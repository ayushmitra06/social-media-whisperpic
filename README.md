# WhisperPic
WhisperPic is a social media application where users can upload, like, comment, and delete posts. The app is built using React, Firebase for backend services.
![whisperpic](https://github.com/user-attachments/assets/d46fdd3e-cf64-4846-a370-f26ae7097a42)

## Features

- User authentication (Sign Up and Sign In)
- Upload images with captions
- Like posts
- Comment on posts
- Delete own posts
- Real-time updates with Firebase Firestore

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/whisperpic.git
   cd whisperpic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication (Email/Password).
   - Copy the Firebase config object from your Firebase project settings.

4. **Configure Firebase**:
   - Create a `FireBase.js` file in the `src` directory.
   - Add your Firebase config to `FireBase.js`:
     ```javascript
     // src/FireBase.js
     import { initializeApp } from "firebase/app";
     import { getFirestore } from "firebase/firestore";
     import { getAuth } from "firebase/auth";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
     const auth = getAuth(app);

     export { db, auth };
     ```

5. **Start the application**:
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Usage

- **Sign Up**: Create a new account using your email and password.
- **Sign In**: Log in using your email and password.
- **Upload Post**: Once logged in, you can upload a new post with an image and a caption.
- **Like Post**: Click the like button to like a post. Click again to unlike.
- **Comment on Post**: Add a comment to any post.
- **Delete Post**: Delete your own post using the delete icon.

## Code Structure

- `src/App.js`: Main component that sets up routes and authentication.
- `src/Post.js`: Component to display individual posts.
- `src/ImageUpload.js`: Component for uploading images.
- `src/FireBase.js`: Firebase configuration and initialization.
- `src/App.css`: Main CSS file for styling.

## Dependencies

- React
- Firebase
- Material-UI

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

---

### Troubleshooting

If you encounter any issues:

- **Check Firebase Configuration**: Ensure your Firebase config in `FireBase.js` is correct.
- **Check Console Logs**: Look at the browser console for any errors or warnings.
- **React Toastify Notifications**: Ensure `ToastContainer` is rendered in your root component, and CSS is correctly imported.

### Contact
If you have any questions or need further assistance, feel free to open an issue or contact me directly.
