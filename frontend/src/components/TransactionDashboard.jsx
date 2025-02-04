import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import styles from './TransactionDashboard.module.css';

const API_BASE_URL = 'https://roxiler-backend-kteg.onrender.com/api';

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('march');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const combinedRes = await axios.get(`${API_BASE_URL}/combined-data`, {
        params: { month: selectedMonth }
      });

      const transactionsRes = await axios.get(`${API_BASE_URL}/transactions`, {
        params: { month: selectedMonth, search, page, perPage: 5 }
      });

      setTransactions(transactionsRes.data.transactions);
      setTotalPages(transactionsRes.data.totalPages);
      setStatistics(combinedRes.data.statistics);

      const chartData = Object.entries(combinedRes.data.barChart).map(([range, count]) => ({
        range,
        count
      }));
      setBarChartData(chartData);

      const pieData = Object.entries(combinedRes.data.pieChart).map(([category, count]) => ({
        name: category,
        value: count
      }));
      setPieChartData(pieData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, search, page]);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Transaction Dashboard</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search transaction"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className={styles.monthSelect}
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>${transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                <td>
                  <img src={transaction.image} alt={transaction.title} className={styles.image} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>

      {statistics && (
        <div className={styles.statistics}>
          <h2>Statistics - {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}</h2>
          <div className={styles.statsGrid}>
            <div><strong>Total Sale:</strong> ${statistics.totalSaleAmount}</div>
            <div><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</div>
            <div><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</div>
          </div>
        </div>
      )}

      <div className={styles.charts}>
        <div className={styles.chartContainer}>
          <h2>Bar Chart Stats</h2>
          <BarChart width={800} height={400} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#5CE1E6" />
          </BarChart>
        </div>

        <div className={styles.chartContainer}>
          <h2>Categories</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              cx={200}
              cy={200}
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
