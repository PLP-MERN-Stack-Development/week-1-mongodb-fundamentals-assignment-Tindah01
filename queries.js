// 1. Find all books in a specific genre
db.books.find({ genre: "Programming" });

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 2010 } });

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 11.99 } });

// 5. Delete a book by its title
db.books.deleteOne({ title: "The Lean Startup" });

// ADVANCED QUERIES
// 1. Find books in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 2. Projection: title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// 3. Sorting by price
db.books.find().sort({ price: 1 }); // Ascending
db.books.find().sort({ price: -1 }); // Descending

// 4. Pagination: 5 books per page
db.books.find().skip(0).limit(5); // Page 1
db.books.find().skip(5).limit(5); // Page 2

//AGREGATION PIPELINES
// 1. Average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
]);

// 2. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 3. Books grouped by publication decade
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
      count: 1,
      _id: 0
    }
  }
]);

//INDEXES
// Create index on title
db.books.createIndex({ title: 1 });

// Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to show performance improvement
db.books.find({ title: "1984" }).explain("executionStats");
