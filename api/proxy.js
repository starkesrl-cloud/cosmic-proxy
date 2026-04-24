module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, ...params } = req.query;
  const queryString = new URLSearchParams(params).toString();
  const URL = `https://www.cosmicgroup.eu/api/v1/${path}${queryString ? '?' + queryString : ''}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const risposta = await fetch(URL, fetchOptions);
    const testo = await risposta.text();

    try {
      const dati = JSON.parse(testo);
      if (dati && dati.data) {
        dati.data = dati.data.filter(p => parseInt(p.qt_stock, 10) !== 1);
      }
      res.status(risposta.status).json(dati);
    } catch {
      res.status(risposta.status).send(testo);
    }
  } catch (errore) {
    res.status(500).json({ errore: errore.message });
  }
}
