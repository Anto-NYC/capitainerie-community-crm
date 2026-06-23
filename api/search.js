module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, members } = req.body;
  if (!query || !members) return res.status(400).json({ error: 'query and members required' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: `Tu es un assistant pour La Capitainerie. Tu analyses des profils de membres et tu trouves ceux qui correspondent à une recherche en langage naturel. Tu retournes UNIQUEMENT un JSON valide sans markdown. Format: {"results":[{"memberId":"id","score":85,"reason":"explication courte pourquoi ce membre correspond"}]}. Trie par score décroissant. Ne retourne que les membres avec un score >= 40.`,
        messages: [{
          role: 'user',
          content: `Recherche: "${query}"\n\nProfils des membres:\n${JSON.stringify(members)}`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Anthropic API error', details: err });
    }

    const data = await response.json();
    const text = data.content[0]?.text || '{}';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
