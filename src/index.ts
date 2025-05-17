import express from 'express';
import policyRoutes from './routes/policies';
import fs from "fs";

const oas = JSON.parse(fs.readFileSync('./InsurancePolicy.oas.yaml.json', 'utf8'));

const app = express();
app.use(express.json());

app.use('/policies', policyRoutes);
app.get('/api-docs', (req, res) => {res.json(oas)});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
