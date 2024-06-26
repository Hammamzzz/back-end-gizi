const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { ref, set, get, child, push } = require('firebase/database');
const db = require('./firebaseConfig');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Rute untuk API makanan
app.post('/api/food', (req, res) => {
    const foodData = req.body;
    console.log('Received food data:', foodData);

    const newFoodKey = push(child(ref(db), 'foods')).key;
    const updates = {};
    updates['/foods/' + newFoodKey] = foodData;

    set(ref(db, '/foods/' + newFoodKey), foodData)
        .then(() => {
            res.json({
                message: 'Makanan berhasil ditambahkan!',
                evaluation: `Nama: ${foodData.name}, Kalori: ${foodData.calories}, Protein: ${foodData.protein}`
            });
        })
        .catch(error => res.status(500).json({ error: 'Error adding food data', details: error }));
});

// Rute untuk API catatan kesehatan
app.post('/api/health', (req, res) => {
    const healthRecordData = req.body;
    console.log('Received health record data:', healthRecordData);

    const newHealthKey = push(child(ref(db), 'healthRecords')).key;
    const updates = {};
    updates['/healthRecords/' + newHealthKey] = healthRecordData;

    set(ref(db, '/healthRecords/' + newHealthKey), healthRecordData)
        .then(() => {
            const bmi = healthRecordData.weight / ((healthRecordData.height / 100) ** 2);
            const nutritionalStatus = bmi < 18.5 ? 'Kurus' : bmi >= 25 ? 'Gemuk' : 'Normal';
            res.json({
                message: 'Catatan kesehatan berhasil ditambahkan!',
                bmi: bmi,
                nutritionalStatus: nutritionalStatus
            });
        })
        .catch(error => res.status(500).json({ error: 'Error adding health record data', details: error }));
});

// Rute untuk laporan
app.get('/api/report', (req, res) => {
    const dbRef = ref(db);

    get(child(dbRef, 'foods')).then((snapshot) => {
        if (snapshot.exists()) {
            const foodData = snapshot.val();
            get(child(dbRef, 'healthRecords')).then((healthSnapshot) => {
                if (healthSnapshot.exists()) {
                    const healthRecordData = healthSnapshot.val();
                    res.json({
                        foodData: foodData,
                        healthRecordData: healthRecordData
                    });
                } else {
                    res.status(404).json({ message: 'No health records available' });
                }
            }).catch(error => res.status(500).json({ error: 'Error fetching health records', details: error }));
        } else {
            res.status(404).json({ message: 'No food data available' });
        }
    }).catch(error => res.status(500).json({ error: 'Error fetching food data', details: error }));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});