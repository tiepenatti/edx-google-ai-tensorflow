# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2025-07-03

### Added
- Project is now automatically built and hosted via GitHub Pages at https://tiepenatti.github.io/edx-google-ai-tensorflow/
- Vite config updated with correct `base` for subpath deployment
- SPA fallback and deployment documentation improvements

## [0.6.0] - 2025-04-30

### Added
- **CI/CD Pipeline**: Implemented a GitHub Actions workflow to automate the build and deployment to GitHub Pages.
- **Docker Environment**: Added a `Dockerfile` to create a consistent and reproducible build environment, which helps in debugging CI/CD issues locally.
- Enhanced copy on Fashion MNIST exercise and increased consistency with Handwritten Digit exercise

### Fixed
- Resolved a "JavaScript heap out of memory" error during the build process by increasing the memory limit for Node.js in the `build` script.

## [0.5.0] - 2025-04-29

### Added
- Enhanced Fashion MNIST exercise with Convolutional Neural Network:
  - Implemented CNN architecture with Conv2D and MaxPooling2D layers
  - Added drag-and-drop image URL support with image transformations
  - Real-time 28x28 gray scale preview of model input
  - Interactive image controls (scale, rotation)
  - Side-by-side visualization of original and processed images
  - Improved model accuracy using convolutional layers
  - Support for validation metrics during training
  - Top-2 prediction display with confidence scores

## [0.4.0] - 2025-04-28

### Added
- Enhanced Handwritten Digit Recognition exercise:
  - Improved UI with consistent layout using Material-UI Container and Cards
  - Added error boundary for better error handling
  - Full-width training visualization graph
  - Modular SCSS styling with proper namespace usage
  - Better component organization and error handling
  - Interactive training section with configurable neural network architecture
  - Real-time digit recognition with canvas drawing
  - Dynamic model evaluation capabilities

## [0.3.0] - 2025-04-28

### Added
- Implemented House Pricing exercise:
  - Custom neural network model for real estate price prediction
  - Interactive training interface with configurable parameters
  - Real-time visualization of training progress
  - Multi-feature prediction using house size and number of bedrooms
  - Dynamic scatter plot showing training data and predictions
  - Configurable training parameters (learning rate, optimizer, epochs, batch size)
  - Model evaluation section with custom input testing

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