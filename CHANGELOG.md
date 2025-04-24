# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-04-24

### Added
- Implemented Smart Cam exercise:
  - Real-time object detection using COCO-SSD model
  - Camera integration with user permission handling
  - Live object detection with bounding boxes and labels
  - Toggle switch for classification
  - Proper model and resource cleanup
  - Modular component architecture for maintainability

## [0.1.0] - 2025-04-24

### Added
- Initial project setup with Vite, React 19, TypeScript, and SASS
- Implemented four main exercises:
  - Smart Cam: Object detection using COCO-SSD model
  - House Pricing: Custom NN model for real estate price prediction
  - Handwritten Digit Recognition: Custom NN model using MNIST dataset
  - Fashion Image Recognition: Transfer learning with pre-trained CNN
- Core dependencies:
  - TensorFlow.js for machine learning capabilities
  - Chart.js for data visualization
  - Material-UI components and icons
  - React 19 with TypeScript support
- Project structure:
  - Component-based architecture with SCSS modules
  - Organized folders for components, pages, hooks, and services
  - TypeScript configuration with strict type checking
  - ESLint setup for code quality
- Development workflow:
  - Vite dev server with hot module replacement
  - Concurrent TypeScript compilation and SASS processing
  - Production build optimization