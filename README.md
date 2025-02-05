# Roxiler Task

This project is a full-stack MERN application that fetches transaction data from a third-party API, initializes a database with seed data, and provides multiple APIs for transactions listing, statistics, and visual representations using charts. The frontend consumes these APIs to display a table, statistics, and graphical representations.


## Backend

### Data Source

Third-Party API URL: https://s3.amazonaws.com/roxiler.com/product_transaction.json

Request Method: `GET`

Response Format: `JSON`

## API Endpoints

#### Initialize Database

```http
  GET /api/initialize
```
##### Fetches the JSON data from the third-party API and populates the database.
##### Creates an efficient collection structure for storing transactions.

#### Get Transactions List

```http
  GET /api/transactions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required** Month filter (January - December) |
| `search`      | `string` | **Optional** Search by title, description, or price |
| `page`      | `number` | **Optional** Pagination page number |
| `perpage`      | `number` | **Optional** Items per page |

##### Returns a paginated list of transactions based on the selected month.

##### Supports search functionality across title, description, and price.

#### Get Transactions Statistics

```http
  GET /api/statistics
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required** Month filter (January - December) |

#### Returns:

Total sale amount for the selected month.

Total number of sold items.

Total number of not sold items.

#### Get Transactions Bar Chart Data

```http
  GET /api/bar-chart
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required** Month filter (January - December) |

#### Returns a count of items in the following price ranges:

0 - 100

101 - 200

201 - 300

301 - 400

401 - 500

501 - 600

601 - 700

701 - 800

801 - 900

901+

#### Get Transactions Pie Chart Data

```http
  GET /api/pie-chart
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required** Month filter (January - December) |

#### Returns unique categories and the number of items in each category.

#### Get Combined Data

```http
  GET /api/pie-chart
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required** Month filter (January - December) |

#### Fetches data from the statistics, bar-chart, and pie-chart APIs and returns a combined JSON response.


## Frontend

### Transaction Table

Uses /api/transactions to display transactions.

Includes a dropdown with months (Jan - Dec), defaulting to March.

Supports searching transactions by title, description, or price.

Supports pagination with Next and Previous buttons.

### Transaction Statistics

Uses /api/statistics to fetch and display total sales, sold items, and unsold items for the selected month.

### Transaction Bar Chart

Uses /api/bar-chart to display the distribution of items across price ranges.

### Transaction Pie Chart

Uses /api/pie-chart to show the number of items in each category.
## Tech Stack

**Frontend:** React.js, Axios, React Charts

**Backend:** Node.js, Express.js, MongoDB

**Database:** MongoDB (with Mongoose ODM)

## Setup Instructions

### Prerequisites

Node.js installed

MongoDB installed and running

### Backend Setup
```bash
  cd backend
  npm install
  npm start
```
    
### Frontend Setup
```bash
  cd frontend
  npm install
  npm start
```
    
## API Testing

Use Postman or any API client to test the endpoints.


## Future Enhancements

Implement authentication and role-based access.

Improve UI with additional filters and sorting.

Optimize database queries for better performance.


## Conclusion

This project provides a comprehensive full-stack solution to manage and visualize transaction data. It ensures efficient data retrieval, filtering, and visualization for an enhanced user experience.

