# edX Google AI TensorFlow.js
This is a simple project demonstrating the exercises learned from edX course by Google on tensorflow.js regarding AI and ML.

## Technical Stack

This project is built using modern web technologies:
- **React 19** - UI library for building component-based interfaces
- **TypeScript** - For type-safe JavaScript development
- **SASS/SCSS** - For enhanced CSS styling with modules support
- **Vite** - Next-generation frontend tooling for fast development and building
- **Material-UI** - React component library implementing Google's Material Design
- **TensorFlow.js** - Machine learning library for JavaScript
- **Chart.js** - For data visualization

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development
To start the development server with hot-reload:
```bash
npm run dev
```
This will:
- Start Vite dev server
- Watch for TypeScript compilation
- Compile SASS files automatically

The application will be available at `http://localhost:5173`

### Building for Production
To create a production build:
```bash
npm run build
```

### Preview Production Build
To preview the production build locally:
```bash
npm run preview
```

### Linting
To run the linter:
```bash
npm run lint
```

## Exercises

### **Smart Cam**
- Using prebuilt NN model [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) to recognize objects from camera in your browser.
- Intro section describing the use of the camera and images for classification with note for privacy
- Camera section: canvas with button to start camera that triggers asking for user permission
- Once camera is enabled, the model is loaded and starts to draw overlay boxes of found objects with it's name and probability
- Switch to turn on and off the classification of images
- Button to cleanup, disposing model and data used

### **House Pricing**
- Uses a custom built very simple NN model to train on synthetic real state pricing data (floor size, number of bedrooms and house price) provided by [Google]('https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js') which represents a liner regression problem in which a single neuron is able to give an estimation.
- Data is provided with real numbers and should be normalized before training.
- Section 1: Info section: some basic info on how the page works
- Section 2: Training Section containing:
     - inputs for selecting training parameters (learning rate, optimizer function, loss function, validation split, batch size and number of epochs for training)
     - a button to start training
     - a button to stop training (enable if training is in progress)
     - a button to show details on the model using the tf.vis side panel
     - a section with 2 graphs using chart.js: 
         * The training accuracy per epoch linear graph
         * The scattered plot of the floor size vs price, colored by no of bedrooms
- Section 3: Evaluation section containing:
     - inputs for floor size and number of bedrooms
     - a button to trigger the model predict the house price given the inputs
     - a section to show the estimated house price
     - a button to clean up the model and memory

### **Handwritten Digit Recognition**
- Uses a custom built NN model with only dense layers to train on a subset of the MNIST dataset provided by [Google]('https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js').
- Data is provided with already normalized numbers (0-1), on a gray scale image of 28x28 pixels, having background as black, and handwritten digits as white or any shade of gray.
- The model learns to recognize digits, but given the simplified structure and types of layers, it struggles to recognize unseen digits that are drawn tilted, scaled or panned on different areas of the grid.
- Info section: some basic info on how the page works
- Training Section containing:
     - inputs for selecting training parameters (learning rate, optimizer function, loss function, validation split, batch  size and number of epochs for training)
     - a section to customize the internal layers architecture with 2 buttons to add/remove new hidden layers, and an input for each added layer with the number of units in each layer.
     - a button to start training
     - a button to stop training (enable if training is in progress)
     - a button to show details on the model using the tf.vis side panel
     - a section with 1 graphs using chart.js: 
         * The training accuracy per epoch linear graph
- Evaluation section with 2 canvas side by side:
     - a 280x280 pixels canvas to hand-draw a digit with the mouse
         - a button to clear the canvas
         - a button to trigger the model predict the drawn digit
         - two buttons to increase/decrease the mouse trace width
     - a 280x280 pixels canvas with a grid every 10 pixels to represent the image being sent to the model for evaluation
         - a button to randomly pick an image from the training dataset to evaluate classification from model
     - a section to show the estimated digit with it's probability, and the second contender with its probability
     - a button to clean up the model and memory


### **Fashion Image Recognition**
- Uses a custom built head NN model to predict on top of pre-trained Convolutional NN using a preprocessed fashion MNIST dataset provided by [Google]('https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js') to practice learning transfer
- Data is provided non-normalized numbers (0-255), on a gray scale image of 28x28 pixels, having background as black, and image in white or shades of gray.
- The model uses a pre-trained CNN to recognize image features and gets trained into this subset of the fashion MNIST
- Info section: some basic info on how the page works
- Training Section containing:
     - inputs for selecting training parameters (learning rate, optimizer function, loss function, validation split, batch  size and number of epochs for training)
     - a section to customize the internal layers architecture with 2 buttons to add/remove new hidden layers, and an input for each added layer with the number of units in each layer.
     - a button to start training
     - a button to stop training (enable if training is in progress)
     - a button to show details on the model using the tf.vis side panel
     - a section with 1 graphs using chart.js: 
         * The training accuracy per epoch linear graph
- Evaluation section with:
     - a 280x280 pixels canvas with a grid every 10 pixels to represent the image being sent to the model for evaluation
     - a button to randomly pick an image from the training dataset to evaluate classification from model
     - two buttons to increase/decrease the scaled of the image
     - two buttons to increase/decrease the rotation of the image
     - two buttons to change the x and y position of the image
     - a button to randomly add noise
     - a section to show the estimated digit with it's probability, and the second contender with its probability
     - a button to clean up the model and memory
