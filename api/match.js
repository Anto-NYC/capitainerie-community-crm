// api/match.js — Vercel Serverless Function
// Sécurise la clé Anthropic côté serveur

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { baseMember, candidates } = req.body;

  if (!baseMember || !candidates || candidates.length === 0) {
    return res.status(400).json({ error: 'baseMember and candidates required' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Strip Firebase metadata — only keep fields relevant for matching
  const MATCHING_FIELDS = ['id','firstName','lastName','city','profession','familyStatus','lifestyle','passion1','passion2','investmentDomains','trigger','brings','seeks','threeWords','threeWordsArray','cohortName','cohortNumber','onboardingStatus'];
  const strip = (m) => Object.fromEntries(MATCHING_FIELDS.filter(k => m[k] != null).map(k => [k, m[k]]));

  const cleanBase = strip(baseMember);
  const cleanCandidates = candidates.map(strip);

  const SYSTEM = `Tu es un expert en matching communautaire pour La Capitainerie, une communauté d'entrepreneurs et investisseurs immobiliers premium.
Tu analyses des profils selon 8 critères pondérés : Complémentarité apports/besoins (30%), Résonance déclencheurs (25%), Compatibilité personnalité (15%), Valeur long terme (10%), Passions (7%), Style de vie (5%), Statut familial (4%), Domaines investissement (4%).
Réponds UNIQUEMENT en JSON valide, sans markdown, sans texte avant ou après.`;

  const callClaude = async (prompt, maxTokens, attempt = 1) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: maxTokens, system: SYSTEM, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const isOverloaded = body?.error?.type === 'overloaded_error';
      if (isOverloaded && attempt < 4) {
        const delay = attempt * 3000; // 3s, 6s, 9s
        await new Promise(r => setTimeout(r, delay));
        return callClaude(prompt, maxTokens, attempt + 1);
      }
      throw new Error(body?.error?.message || `Anthropic API error ${response.status}`);
    }

    const data = await response.json();
    const text = (data.content[0]?.text || '').replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  };

  try {
    // ── Passe 1 : scores uniquement pour tous les candidats ──────────────────
    const pass1Prompt = `Profil de base :
${JSON.stringify(cleanBase, null, 2)}

Candidats à scorer :
${JSON.stringify(cleanCandidates.map(c => ({ id: c.id, brings: c.brings, seeks: c.seeks, trigger: c.trigger, profession: c.profession, passion1: c.passion1, passion2: c.passion2, lifestyle: c.lifestyle, familyStatus: c.familyStatus, investmentDomains: c.investmentDomains })), null, 2)}

Retourne UNIQUEMENT ce JSON — juste les scores, pas d'analyse :
{ "scores": [{ "memberId": "id", "score": 85 }] }
Trie par score décroissant.`;

    const pass1 = await callClaude(pass1Prompt, 1000);
    const top5ids = (pass1.scores || []).slice(0, 5).map(s => s.memberId);
    const top5candidates = cleanCandidates.filter(c => top5ids.includes(c.id));

    // ── Passe 2 : analyse détaillée des 5 meilleurs uniquement ──────────────
    const pass2Prompt = `Profil de base :
${JSON.stringify(cleanBase, null, 2)}

Analyse ces 5 candidats en détail :
${JSON.stringify(top5candidates, null, 2)}

Retourne ce JSON :
{
  "matches": [
    {
      "memberId": "id_du_candidat",
      "score": 85,
      "criteria": {
        "complementarity": { "score": 28, "max": 30, "reason": "..." },
        "triggers": { "score": 22, "max": 25, "reason": "..." },
        "personality": { "score": 12, "max": 15, "reason": "..." },
        "longTermValue": { "score": 8, "max": 10, "reason": "..." },
        "passions": { "score": 5, "max": 7, "reason": "..." },
        "lifestyle": { "score": 4, "max": 5, "reason": "..." },
        "familyStatus": { "score": 3, "max": 4, "reason": "..." },
        "investment": { "score": 3, "max": 4, "reason": "..." }
      },
      "summary": "Résumé en 2-3 phrases du potentiel de cette mise en relation",
      "firstMessage": "Suggestion de message d'introduction personnalisé"
    }
  ]
}`;

    const pass2 = await callClaude(pass2Prompt, 8000);
    return res.status(200).json(pass2);

  } catch (error) {
    console.error('Match API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
