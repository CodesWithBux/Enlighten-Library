/* Enlighten — shared data. Loaded first on every page.
   Add `img:"path.jpg"` to any book to use a real cover image. */
var BOOKS = [
  { id: 1, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", year: 1813, color: "#16213E", rating: 4.7, count: "1.2k", price: 89, blurb: "A sharp, witty portrait of love and misunderstanding among the English gentry. Elizabeth Bennet must weigh pride, prejudice, and her own first impressions." },
  { id: 2, title: "The Time Machine", author: "H. G. Wells", genre: "Sci-fi", year: 1895, color: "#0E7C66", rating: 4.4, count: "860", price: 75, blurb: "A Victorian scientist travels far into humanity's future and finds a world utterly transformed. A foundational work of speculative fiction." },
  { id: 3, title: "Frankenstein", author: "Mary Shelley", genre: "Gothic", year: 1818, color: "#6B2737", rating: 4.6, count: "1.5k", price: 95, blurb: "A young scientist creates life and must reckon with what he has made. A meditation on ambition, responsibility, and isolation." },
  { id: 4, title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", year: 1847, color: "#2D4B73", rating: 4.5, count: "990", price: 85, blurb: "An orphaned governess seeks independence, dignity, and love against the odds. A landmark of first-person Gothic romance." },
  { id: 5, title: "Moby-Dick", author: "Herman Melville", genre: "Adventure", year: 1851, color: "#7A3B2E", rating: 4.2, count: "640", price: 99, blurb: "A relentless sea captain hunts the white whale that maimed him. An epic of obsession set across the open ocean." },
  { id: 6, title: "Dracula", author: "Bram Stoker", genre: "Gothic", year: 1897, color: "#3A2E5C", rating: 4.5, count: "1.1k", price: 89, blurb: "A count's arrival in England unleashes an ancient predatory evil. Told through letters, journals, and fragments." },
  { id: 7, title: "Great Expectations", author: "Charles Dickens", genre: "Fiction", year: 1861, color: "#1F4E46", rating: 4.3, count: "720", price: 79, blurb: "An orphan's mysterious fortune draws him from a village forge into high society. A story of class, gratitude, and self-deception." },
  { id: 8, title: "The Count of Monte Cristo", author: "Alexandre Dumas", genre: "Adventure", year: 1844, color: "#43306B", rating: 4.8, count: "1.8k", price: 119, blurb: "Wrongly imprisoned, a young man escapes to engineer an intricate revenge. A sweeping tale of patience and justice." }
];

/* Sample placeholder reviews — not real reader data. */
var REVIEWS = [
  { name: "A. Mokoena", initials: "AM", stars: 5, text: "Held up far better than I expected for something this old. The pacing surprised me." },
  { name: "L. van Wyk", initials: "LV", stars: 4, text: "A slow start, but the second half is worth it. Beautifully written throughout." },
  { name: "T. Dlamini", initials: "TD", stars: 5, text: "One of those books you finish and immediately want to talk to someone about." }
];
