const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const bandaRoutes = require('./routes/bandaRoutes');
const disponibilidadRoutes = require('./routes/disponibilidadRoutes');
const busquedaRoutes = require('./routes/busquedaRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SabaneraConnect API funcionando correctamente.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bandas', bandaRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);
app.use('/api/busqueda', busquedaRoutes);
app.use('/api/solicitudes', solicitudRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});