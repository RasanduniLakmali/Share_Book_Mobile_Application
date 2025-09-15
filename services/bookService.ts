import { collection, doc, updateDoc } from "firebase/firestore";
import {db} from "@/firebase"
import { Book } from "@/types/book";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase"; // use alias path for consistency
import { addDoc } from "firebase/firestore";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";


export const booksRef = collection(db,"books")

export const saveBook = async (book: Book) => {
  let coverImageUrl: string | null = null;
  let pdfFileUrl: string | null = null;

  try {
    // Upload cover image (if provided)
    if (book.coverImage) {
      coverImageUrl = await uploadToCloudinary(book.coverImage, "image");
      console.log("Cover image uploaded:", coverImageUrl);
    }

    // Upload PDF (if provided)
    if (book.pdfFile) {
      pdfFileUrl = await uploadToCloudinary(book.pdfFile, "pdf");
      console.log("PDF uploaded:", pdfFileUrl);
    }

    // Save book with Cloudinary URLs
    const docRef = await addDoc(booksRef, {
      ...book,
      coverImage: coverImageUrl,
      pdfFile: pdfFileUrl,
    });

    console.log("Book saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving book:", error);
    throw error;
  }
};


export const uploadToCloudinary = async (fileUri: string, type: 'image' | 'pdf') => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: type === 'image' ? 'image/jpeg' : 'application/pdf',
    name: type === 'image' ? 'cover.jpg' : 'book.pdf',
  } as any);

  // Must match your unsigned preset exactly
  formData.append('upload_preset', 'book_upload');

  // Use your cloud name (dbmzwhgl)
  const endpoint = `https://api.cloudinary.com/v1_1/dbmzwhglz/${type === "image" ? "image" : "raw"}/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  console.log("Cloudinary response full:", JSON.stringify(data, null, 2));

  if (!data.secure_url) {
    throw new Error(data.error?.message || "Upload failed - no secure_url");
  }

  return data.secure_url;
};






export const updateBook = async(id:string,book:Book) => {
     const updateRef = doc(db,"books",id)

     const {id: _id,...bookData} = book;
     return updateDoc(updateRef,bookData)
     
}