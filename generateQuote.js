const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Function to pick a random quote
function getRandomQuote() {
    const quotesPath = path.join(__dirname, 'quotes.json');
    const quotesData = fs.readFileSync(quotesPath, 'utf8');
    const quotes = JSON.parse(quotesData);
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to generate the image
async function generateQuoteImage(quote, author) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Load the HTML template
    const htmlTemplate = fs.readFileSync(path.join(__dirname, 'quoteCard.html'), 'utf8');

    // Replace the placeholders with the actual quote and author
    const htmlContent = htmlTemplate
        .replace('{{quote}}', quote)
        .replace('{{author}}', author);

    // Set the page content
    await page.setContent(htmlContent);

    // Select the quote box element
    const quoteElement = await page.$('.quote-frame');  // Select the quote frame by class

    // Take a screenshot of the quote element
    const imagePath = 'quoteImage.png';
    await quoteElement.screenshot({ path: imagePath });

    console.log('Image saved at:', imagePath);

    await browser.close();
}

// Get a random quote and generate the image
const { quote, author } = getRandomQuote();
generateQuoteImage(quote, author).then(() => {
    console.log('Image generated successfully!');
}).catch(err => {
    console.error('Error generating image:', err);
});
