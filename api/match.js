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

  const systemPrompt = `Tu es un expert en matching communautaire pour La Capitainerie, une communauté d'entrepreneurs et investisseurs immobiliers premium.

Tu analyses des profils de membres et calcules des scores de compatibilité selon ces 8 critères pondérés :
1. Complémentarité apports/besoins : 30%
2. Résonance des déclencheurs d'entrée : 25%
3. Compatibilité de personnalité : 15%
4. Valeur mutuelle long terme : 10%
5. Passions communes : 7%
6. Style de vie compatible : 5%
7. Statut familial similaire : 4%
8. Domaines d'investissement communs : 4%

Pour chaque candidat, retourne un score global de 0 à 100 et un raisonnement détaillé.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans texte avant ou après.`;

  const userPrompt = `Profil de base :
${JSON.stringify(baseMember, null, 2)}

Candidats à évaluer :
${JSON.stringify(candidates, null, 2)}

Retourne ce JSON exact :
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

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Anthropic API error', details: err });
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const clean = text.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Match API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
