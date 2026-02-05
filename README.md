# Autoflex – Stock Control API

REST API developed to manage products, raw materials and production suggestions based on available stock.

---

## API Endpoints

### Products
- GET /products  
- GET /products/:id  
- POST /products  
- PATCH /products/:id  
- DELETE /products/:id  

---

### Raw Materials
- GET /raw-materials  
- GET /raw-materials/:id  
- POST /raw-materials  
- PATCH /raw-materials/:id  
- DELETE /raw-materials/:id  

---

### Product × Raw Material
- GET /product-materials  
- GET /product-materials?productId=:id  
- POST /product-materials  
- PATCH /product-materials/:id  
- DELETE /product-materials/:id  

---

### Production Suggestion
- GET /production/suggestion  

---

## Production Suggestion Rule

- Products are processed in descending order of unit price  
- Available raw material stock is evaluated for each product  
- The maximum producible quantity is calculated based on the limiting raw material  
- Stock is consumed progressively  
- The result returns:
  - Product
  - Quantity that can be produced
  - Total value per product
  - Grand total value

This logic prioritizes higher value products, as required.

---

## Error Handling

- 409 Conflict – Unique constraint violation  
- 404 Not Found – Resource not found  
- 500 Internal Server Error – Unexpected error  

---

## Notes

- Backend only
- API ready to be consumed by any frontend
- All responses are formatted to avoid BigInt and Decimal serialization issues