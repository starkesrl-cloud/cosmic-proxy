export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, ...params } = req.query;
  const queryString = new URLSearchParams(params).toString();
  const url = `https://www.cosmicgroup.eu/api/v1/${path}${queryString ? '?' + queryString : ''}`;

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

    const response = await fetch(url, fetchOptions);
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
if (data && data.objects) {
  data.objects = data.objects.filter(p => parseInt(p.qt_stock, 10) !== 1);
}
res.status(response.status).json(data);

    } catch {
      res.status(response.status).send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
