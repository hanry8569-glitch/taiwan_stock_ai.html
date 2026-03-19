export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { sym, type } = req.query;
  if (!sym) { res.status(400).json({ error: 'missing sym' }); return; }

  try {
    let url;
    if (type === 'summary') {
      url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${sym}?modules=summaryDetail,defaultKeyStatistics,financialData,assetProfile`;
    } else {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=3mo`;
    }

    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      }
    });

    if (!r.ok) { res.status(r.status).json({ error: 'upstream error' }); return; }
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
