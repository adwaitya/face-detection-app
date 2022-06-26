import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({image}: any) => {
    const { url, width, height } = image;
    const [faces, setFaces] = useState<any>([]);
    const [friends, setFriends] = useState<any>([]);
  
    const imgRef = useRef<any>();
    const canvasRef = useRef<any>();
  
    const handleImage = async () => {
      const detections = await faceapi.detectAllFaces(
        imgRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      setFaces(detections.map((d) => Object.values(d.box)));
    };
  
    const enter = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.lineWidth = 5;
      ctx.strokeStyle = "yellow";
      faces.map((face:any) => ctx.strokeRect(...face));
    };
  
    useEffect(() => {
      const loadModels = () => {
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ])
          .then(handleImage)
          .catch((e) => console.log(e));
      };
  
      imgRef.current && loadModels();
    }, []);
    const addFriend = (e:any) => {
        setFriends((prev:any) => ({ ...prev, [e.target.name]: e.target.value }));
      };
    
      console.log(width, height);
  return (
    <div className="container">
    <div className="left" style={{ width, height }}>
      <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
      <canvas
        onMouseEnter={enter}
        ref={canvasRef}
        width={width}
        height={height}
      />
      {faces.map((face:any, i:number) => (
        <input
          name={`input${i}`}
          style={{ left: face[0], top: face[1] + face[3] + 5 }}
          placeholder="Tag a friend"
          key={i}
          className="friendInput"
          onChange={addFriend}
        />
      ))}
    </div>
    <div className="right">
      <h1>Share your post</h1>
      <input
        type="text"
        placeholder="What's on your mind?"
        className="rightInput"
      />
      {friends && (
        <span className="friends">
          with <span className="name">{Object.values(friends) + " "}</span>
        </span>
      )}
      <button className="rightButton">Send</button>
    </div>
  </div>
  )
}

export default NewPost