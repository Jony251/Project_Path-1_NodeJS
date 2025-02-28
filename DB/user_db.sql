-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2025 at 03:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `user_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `stock`, `category`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Table', 1200.00, NULL, 0, NULL, NULL, '2025-02-28 13:25:15', '2025-02-28 13:25:15'),
(4, 'Product Name', 99.99, 'Product description', 10, 'Electronics', 9, '2025-02-28 13:52:34', '2025-02-28 13:52:34'),
(5, 'Product Name', 99.99, 'Product description', 10, 'Electronics', 9, '2025-02-28 13:52:53', '2025-02-28 13:52:53');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `session` text NOT NULL,
  `expires` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`sid`, `session`, `expires`) VALUES
('J9o67xliTSUQS5tRbNsdV788ujwcLaUe', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-03-01T13:54:48.673Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":10,\"isAdmin\":false}', 1740837289);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` varchar(10) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `role`) VALUES
(1, 'John Doe', 'john@example.com', '$2b$10$JVz3WFz2LfgJVC8XvAwNTeQUeFoCKz9aEqJKC/vD2jp04yYts38Ne', '2025-01-22 17:36:19', '2025-02-06 10:42:47', 'user'),
(2, 'John Doe', 'jane@example.com', '$2b$10$IoHg8yf.H0qbus6Tqzoo7u4CFbM6fZixKzHUZZi/nTzqaMlR6xBBi', '2025-01-22 17:36:19', '2025-02-06 10:43:19', 'user'),
(4, 'John Doe', 'exemple@gmail.com', '$2b$10$cfwgd4tcfZHdoHM27/u8UegmGzLMJqAd3I./iarNvaQUJeYCoPntu', '2025-01-29 18:05:27', '2025-02-06 10:44:38', 'user'),
(7, 'John Su', 'johnatan@example.com', '$2b$10$G0UMrtwmSQ.Q0c0S3pU/PeV4HUqOvqnD8NRD7Zn3lbP5di9Blkmme', '2025-02-06 10:40:33', '2025-02-06 10:41:48', 'user'),
(8, 'Test User', 'test@example.com', '$2b$10$3AFa6Gg5ca5MLML1FWAIZu3i6MKIcMa6F85zal2fhUM1sh/xZSlNe', '2025-02-28 13:21:14', '2025-02-28 13:21:14', 'user'),
(9, 'Evgen', 'test@t.com', '$2b$10$vBRKelyJVuZh9MQfr57qyOZ3Si7LpXpPpiX.1Bpg/4BvFRfIUpTnq', '2025-02-28 13:22:12', '2025-02-28 13:49:14', 'admin'),
(10, 'Leon', 'Leon@test.com', '$2b$10$h/BavpG6oz3mQvA9UP7Bwu9hc.hYCaY/KBv62hWo2gu9XyvSbLQSu', '2025-02-28 13:46:25', '2025-02-28 13:46:25', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `sess_cleanup` ON SCHEDULE EVERY 15 MINUTE STARTS '2025-02-28 15:01:12' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM `sessions` WHERE sid IN (SELECT temp.sid FROM (SELECT `sid` FROM `sessions` WHERE `expires` > 0 AND `expires` < UNIX_TIMESTAMP()) AS temp)$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
