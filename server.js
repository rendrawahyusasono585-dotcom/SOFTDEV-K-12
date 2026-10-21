const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const SLOTS_FILE = path.join(__dirname, 'slots.json');
const RESERVATIONS_FILE = path.join(__dirname, 'reservations.json');

// 1. Endpoint untuk mengambil daftar slot yang tersedia
app.get('/api/slots', (req, res) => {
    fs.readFile(SLOTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca data slot.' });
        }
        res.json(JSON.parse(data));
    });
});

// 2. Endpoint untuk melakukan booking/reservasi
app.post('/api/booking', (req, res) => {
    const { slotId, userName } = req.body;

    if (!slotId || !userName) {
        return res.status(400).json({ error: 'Slot ID dan Nama User wajib diisi!' });
    }

    // Baca slots.json
    fs.readFile(SLOTS_FILE, 'utf8', (err, slotData) => {
        if (err) return res.status(500).json({ error: 'Gagal membaca slot.' });

        let slots = JSON.parse(slotData);
        let slot = slots.find(s => s.id === slotId);

        if (!slot) {
            return res.status(404).json({ error: 'Slot tidak ditemukan.' });
        }

        if (slot.isBooked) {
            return res.status(400).json({ error: 'Slot sudah dibooking oleh orang lain!' });
        }

        // Update status slot menjadi booked
        slot.isBooked = true;
        slot.bookedBy = userName;

        // Simpan kembali ke slots.json
        fs.writeFile(SLOTS_FILE, JSON.stringify(slots, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Gagal menyimpan slot.' });

            // Buat kode booking unik
            const bookingCode = 'BOOK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const newReservation = { bookingCode, slotId, userName, date: new Date() };

            // Simpan ke reservations.json
            fs.readFile(RESERVATIONS_FILE, 'utf8', (err, resData) => {
                let reservations = [];
                if (!err && resData) {
                    reservations = JSON.parse(resData);
                }
                reservations.push(newReservation);

                fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), (err) => {
                    if (err) return res.status(500).json({ error: 'Gagal menyimpan reservasi.' });

                    res.status(201).json({
                        message: 'Booking berhasil!',
                        bookingCode,
                        slot
                    });
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di: http://localhost:${PORT}`);
});