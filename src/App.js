import './App.css';
import minimize from "./images/min.png";
import close from "./images/cross.png";
import info from "./images/info.png";
import {React, useEffect, useRef, useState} from 'react';

function App() {
  const [coords, setCoords] = useState({})
  const [mouseDown, setMouseDown] = useState(false)
  const [drawWidth, setDrawWidth] = useState(40)
  const [drawColor, setDrawColor] = useState("#000000")
  const [menuClosed, setMenuClosed] = useState(false)
  const [start, setStart] = useState(true)
  const [popupClosed, setPopupClosed] = useState(false)
  const canvasRef = useRef(null)
  const lastDrawRef = useRef(null)

  useEffect(() => {
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
    clear();

    const globalMouseMove = (e) => {
      setCoords({x: e.clientX - canvasRef.current.offsetLeft, y: e.clientY - canvasRef.current.offsetTop})
    }

    const resizeCanvas = (e) => {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      clear();
    }

    window.addEventListener("mousemove", globalMouseMove)
    window.addEventListener("resize", resizeCanvas)
  }, [])

  const clear = () => {
    console.log("CLEAR")
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const save = () => {
    const img = canvasRef.current.toDataURL();
    var downloadLink = document.createElement('a');
    downloadLink.href = img;
    downloadLink.download = 'drawing.png';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const draw = (x, y, lastDraw=null) => {
    const ctx = canvasRef.current.getContext("2d")
    ctx.fillStyle = ctx.strokeStyle = drawColor
    if(lastDraw != null && lastDraw.current != null)
    {
      ctx.beginPath()
      ctx.moveTo(lastDraw.current.x, lastDraw.current.y)
      ctx.lineWidth = drawWidth
      ctx.lineWidth += 2
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.closePath()
      ctx.lineWidth = 1
    }

    ctx.beginPath()
    ctx.arc(x, y, drawWidth / 2, 0, 360)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()

    if(lastDraw != null)
    {
      lastDraw.current = {x: x, y: y}
    }
  }

  return (
    <div>
      {!popupClosed ? <div className="popup_container">
        <div className="popup">
          <input className="close_button" type="image" src={close} alt="close" onClick={() => {setPopupClosed(true)}}/>
          <div className="popup_content">
            <h1>Welcome to my painting project</h1>
            <div className="main_text"><p>Draw anything you want, you can increase or decrease the brush size, or change the brush color. After you have created your drawing, download it to your computer.</p></div>
            <p className="sign">Created by Maxwell Roberts<br/><br/><a href="https://github.com/RobertsMaxwell" target="_blank" rel="noreferrer">github.com/RobertsMaxwell</a></p>
          </div>
        </div>
      </div> : ""}
      <div className="container" onMouseUp={() => {setMouseDown(false)}} 
        onMouseMove={() => {
          if(mouseDown) {
            draw(coords.x, coords.y, lastDrawRef)
          } else {
            lastDrawRef.current = null
          }
        }}
        onTouchMove={e => {
          const touch = e.touches[0]
          draw(touch.clientX, touch.clientY, lastDrawRef)
        }}
        onTouchEnd={e => {
          lastDrawRef.current = null
        }}>
        
        
        <input className="info" type="image" src={info} alt="info" onClick={() => {setPopupClosed(false)}}/>

        <div className={`menu ${!start ? menuClosed ? 'close' : 'open' : ''}`}>
          <div className="opt_head">
            {!menuClosed ? 
            <div className="min">
              <input type="image" src={minimize} height="20" alt="minimize" onClick={() => {setStart(false); setMenuClosed(true)}}/>
            </div>
            :
            <div className="max">
              <input type="image" src={minimize} height="20" alt="maximize" onClick={() => {setMenuClosed(false)}}/>
            </div>
          }
            <div className="title">
              <h3>Options</h3>
            </div>
          </div>
          <div className="opt">
            <div><label>Brush Size</label></div>
            <div><input type="range" min="5" max="80" value={drawWidth} onChange={e => {setDrawWidth(e.target.value)}} /></div>
          </div>
          <div className="opt">
            <div><label>Brush Color</label></div>
            <div><input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)}/></div>
          </div>
          <div className="util">
            <button onClick={clear}>Clear</button>
            <button onClick={save}>Download</button>
          </div>
        </div>

        <div className="canvas">
          <canvas 
          onMouseDown={e => {
            draw(e.clientX, e.clientY)
            setMouseDown(true)
          }}
          ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
    
  );
}

export default App;
