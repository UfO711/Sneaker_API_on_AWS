const express = require('express');
const cors = require('cors');
const SneaksAPI = require('sneaks-api');
const app = express();
const sneaks = new SneaksAPI();

const filterKeywords = ['fleece', 'jacket', 'backpack', 'hood', 'head','sunglasses', 'glasses', 'bag', 'Louis Vuitton', 'Jersey']; 

// Enable CORS
app.use(cors());

app.get('/api/popular-sneakers', (req, res) => {
    sneaks.getMostPopular(12, (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Filter products to exclude those with names containing the keywords
        const filteredProducts = products.filter(product => {
            return !filterKeywords.some(keyword => 
                product.shoeName.toLowerCase().includes(keyword.toLowerCase())
            );
        });

        res.json(filteredProducts);
    });
});

app.get('/api/search-sneakers', (req, res) => {
    const searchQuery = req.query.q; // 'q' is the query parameter from the search bar
    console.log(`Search Query: ${searchQuery}`);
    
    sneaks.getProducts(searchQuery, 30, (err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: err.message });
        }

        // Filter products to exclude those with names containing the keywords
        const filteredProducts = products.filter(product => {
            return !filterKeywords.some(keyword => 
                product.shoeName.toLowerCase().includes(keyword.toLowerCase())
            );
        });

        res.json(filteredProducts);
    });
});

// app.get('/search/:shoe', function (req, res) {
//     const count = req.query.count || 40;
//     sneaks.getProducts(req.params.shoe, count, function (error, products) {
//         if (error) {
//             console.log(error);
//             res.send("Product Not Found");
//         } else {
//             res.json(products);
//         }
//     });
// });

app.get('/api/product-prices/:productId', (req, res) => {
    const productId = req.params.productId;
    sneaks.getProductPrices(productId, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(product);
    });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });     