import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.set('view engine','ejs');

app.arguments(express.static("public"));

app.get("/", async (req,res)=>{
    const city = req.query.city;

    if (!city){
        return res.render("index.ejs", {
            weatherData:null,
            error:"Please enter a city name"
        });
    } try{
        const apiKey = process.env.OPENWEATHER_API_KEY ||"YOUR_API_KEY";
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const {data } = await axios.get(apiUrl);

        const tomorrowForeCast = data.list[8];
        const willRain = tomorrowForeCast.weather.some(weather => weather.main === "Rain");

        res.render("index.ejs",{
            weatherData:{
                city: data.city.name,
                willRain
            },
            error: null
        }); 
        } catch (error){
            console.error("error fetching weather data:", error.response?.data || error.message);
            res.status(500).render("render.ejs",{
                weatherData:null,
                error :"unable to retrieve weather information. Please check the city name and try again."
            });
        }
    });

app.listen(port,() =>{
    console.log(`Server is running on ${port}`);
});