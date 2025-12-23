import './NoteBubble.css'

function NoteBubble({ text, isEmpty = false }) {
  return (
    <div className="note-bubble-wrapper">
      <div className={`note-bubble ${isEmpty ? 'empty' : ''}`}>
        <div className="note-bubble-content">
          <span className="note-bubble-text">{text}</span>
        </div>
      </div>
      <div className="note-bubble-tail">
        <div className="tail-circle-1"></div>
        <div className="tail-circle-2"></div>
      </div>
    </div>
  )
}

export default NoteBubble
