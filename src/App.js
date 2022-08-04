import React from 'react';
import ImageUploading from 'react-images-uploading';
import axios from 'axios';

export function App() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const baseURL = "http://localhost:8080/";

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const onUploadImages = (image) => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
      }
    };

    const formData = new FormData();
    formData.append(
      "file",
      image[
        'data_url'
      ].split(',')[1]
    );
    const fData = new FormData();
    fData.append("imageValue", image['data_url'].split(',')[1]);
    axios.post(baseURL + "uploadImage", fData, axiosConfig)
      .then(function (response) {
        console.log('Image uploaded:  ' + response['data']);
      });
    // axios.post("http://localhost:8080/uploadFile", formData, axiosConfig)
    //   .then(function (response) {
    //     console.log('response:');
    //     console.log(response);
    //   });
  }

  const saveAllImage = (imageList) => {
    console.log('Save all images, triggered');
    imageList.map((image, index) => onUploadImages(image));
  }

  const deleteImagesFromStorage = () => {
    console.log('Delete all images triggered');
    axios.delete(baseURL + "deleteAll")
      .then(function (response) {
        console.log('response: ' + response['data']);
      });
  }

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper ">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            &nbsp;
            <button onClick={() => saveAllImage(imageList)}>Save all images</button>
            &nbsp;
            <button onClick={deleteImagesFromStorage}>Delete all images from storage</button>
            &nbsp;
            {
              imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image['data_url']} alt="" width="200" />
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                    <button onClick={() => {
                      console.log('upload image click');
                      onUploadImages(image);
                    }}>Save Image</button>
                  </div>
                </div>
              ))}

          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default App;
