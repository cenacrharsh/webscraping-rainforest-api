const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv").config();
const fs = require("fs");

const PORT = 8000;

const app = express();

//! Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//! Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World !!!");
});

app.post("/get-product", async (req, res) => {
  const listOfASINs = req.body.asin;
  const arrayOfASINs = listOfASINs
    .split(", ")
    .filter((element) => element !== "");

  if (arrayOfASINs.length === 0) {
    res.status(200).send("No Products Found To Scrape, Try Again !!!");
  } else {
    console.log("Array of ASINs received: ", arrayOfASINs);

    let arrayOfScrapedProducts = [];
    let promises = [];

    for (let i = 0; i < arrayOfASINs.length; i++) {
      promises.push(
        //# Making a GET request to rainforest api to get data about a product using it's ASIN
        axios
          .get("https://api.rainforestapi.com/request", {
            params: {
              api_key: process.env.RAINFOREST_API_KEY,
              amazon_domain: "amazon.com",
              asin: arrayOfASINs[i], //* B073JYC4XM
              type: "product",
            },
          })
          .then((response) => {
            //* print the JSON response from Rainforest API
            let responseData = JSON.stringify(response.data, 0, 2);
            console.log("Product Scraped: ", arrayOfASINs[i]);
            arrayOfScrapedProducts.push(JSON.parse(responseData));
          })
          .catch((error) => {
            console.log(error);
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        // console.log("Array Of Scraped Products: ", arrayOfScrapedProducts);

        console.log(
          "Length of Array Of Scraped Products: ",
          arrayOfScrapedProducts.length
        );

        const data = JSON.stringify(arrayOfScrapedProducts, null, 4);
        fs.writeFile("response.json", data, (err) => {
          if (err) {
            throw err;
          }

          console.log("Scraped Data Is Saved In File");
        });

        res.status(200).send({
          message: "Products Scraped Successfully",
          product_data: arrayOfScrapedProducts,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

//! Starting Server
app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
