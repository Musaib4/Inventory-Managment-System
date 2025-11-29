import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = 3000;
import cors from 'cors'
app.use(cors())

const masterData = [
    { id: '#TD74844', dest: 'USA', destFlag: 'flags/usa.png', customer: 'Esther Howard', custAvatar: 'avatars/esther.jpg', delivery: '5-7 days', carrier: 'Kathryn Murphy', carrierAvatar: 'avatars/c1.jpg', cost: 12.5, status: 'On Delivery'},
    { id: '#TD74845', dest: 'Canada', destFlag: 'flags/canada.png', customer: 'Guy Hawkins', custAvatar: 'avatars/guy.jpg', delivery: '10 days', carrier: 'Courtney Henry', carrierAvatar: 'avatars/c2.jpg', cost: 20.0, status: 'Shipped'},
    { id: '#TD74846', dest: 'India', destFlag: 'flags/india.png', customer: 'Wade Warren', custAvatar: 'avatars/wade.jpg', delivery: '2-3 days', carrier: 'Arlene McCoy', carrierAvatar: 'avatars/c3.jpg', cost: 15.0, status: 'Pending'},
    { id: '#TD74847', dest: 'UK', destFlag: 'flags/uk.png', customer: 'Leslie Alexander', custAvatar: 'avatars/leslie.jpg', delivery: '3 days', carrier: 'Theresa Webb', carrierAvatar: 'avatars/c4.jpg', cost: 10.0, status: 'Shipped'},
  ];

const chartfirstdata={
    labels : ['USA', 'Russia', 'Asia', 'Africa', 'Australia'],
    values : [30000, 3000, 10000, 100000, 5284]
}

const chartseconddata = {
  labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  values: [444, 5465, 3200, 4200, 3300, 5284, 3700]
};


app.get("/chart1data",(req,res)=>{
  res.send(chartfirstdata)
})

app.get("/chart2data",(req,res)=>{
  res.send(chartseconddata)
})

app.get("/masterdata",(req, res) => {
    res.send(masterData)
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

