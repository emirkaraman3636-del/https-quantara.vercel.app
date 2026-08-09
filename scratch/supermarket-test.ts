import { validateAndParseRows } from '../src/lib/data-parser';

const mockSupermarketData = [
  {
    'Invoice ID': '3123123',
    'Branch': 'A',
    'City': 'Yangon',
    'Customer type': 'Member',
    'Gender': 'Female',
    'Product line': 'Health and beauty',
    'Unit price': 74.69,
    'Quantity': 7,
    'Tax 5%': 26.1415,
    'Total': 548.9715,
    'Date': '1/5/2019',
    'Time': '13:08',
    'Payment': 'Ewallet',
    'cogs': 522.83,
    'gross margin percentage': 4.761904762,
    'gross income': 26.1415,
    'Rating': 9.1
  }
];

const mockNoProductName = [
  {
    'Date': '2024-01-01',
    'Revenue': 5000,
    'Visits': 1500
  }
];

console.log("=== SUPERMARKET SALES TEST ===");
const result1 = validateAndParseRows(mockSupermarketData);
console.log(JSON.stringify(result1.validation, null, 2));
console.log("Mapped Product Name:", result1.records[0].productName);

console.log("\n=== NO PRODUCT NAME (JUST METRICS) TEST ===");
const result2 = validateAndParseRows(mockNoProductName);
console.log(JSON.stringify(result2.validation, null, 2));
