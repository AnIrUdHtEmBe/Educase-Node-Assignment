import express from "express";
import schoolSchema from "../schema/schemaValidation.js";
import db from "../db/db.js"
const schoolRouter = express.Router();

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * (Math.PI / 180);
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


schoolRouter.post("/addSchool", async(req,res) => {
    const result = schoolSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({error: result.error.flatten() })
    }

    const { name, address, latitude, longitude } = result.data;

    try{
        const [rows] = await db.execute(
            'INSERT INTO  schools (name, address, latitude, longitude) VALUES (?,?,?,?) ',
            [name, address, latitude, longitude]
        );
        res.status(200).json({message: "School added!", id: rows.insertId });
    } catch(err){
        res.status(500).json({error: err.message})
    }
});

schoolRouter.get('/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM schools');

    const sortedSchools = rows
      .map(school => {
        const distance = getDistance(userLat, userLon, school.latitude, school.longitude);
        return { ...school, distance: Number(distance.toFixed(2)) };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export{ schoolRouter }