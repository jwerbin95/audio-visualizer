import React, { Component } from 'react'
import SpeechRecognition from 'react-speech-recognition'
import PropTypes from 'prop-types'

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
}

class Dictaphone extends Component {
  testTranscript(){
      console.log(this.props.finalTranscript)
      let testScript = this.props.finalTranscript.split(" ")
      if(testScript[0].toLowerCase()==="google"){
        testScript.shift()
        let urlString = ""
        testScript.map(function(item){
          urlString+=item+'+'
          return item
        })
        urlString.slice(0, -1)
        window.location.assign(`https://www.google.com/search?ei=EcaHXIXpF8PKswXV8JiQDQ&q=${urlString}&oq=${urlString}&gs_l=psy-ab.3..0l3j0i30l5j0i5i30j0i8i10i30.18609.18983..19185...0.0..0.171.494.2j2......0....1..gws-wiz.......0i71j0i7i30j0i8i7i10i30.L95Y-uyZKpM`)
      }else if(this.props.finalTranscript.toLowerCase()==='add website' ){
        this.props.resetTranscript()
        this.props.toggleMicrophone()
        this.props.checkForm()
      }
      else{
        fetch("http://localhost:3000/command/"+this.props.finalTranscript.toLowerCase()).then(data=>{
          this.props.resetTranscript()
          data.json().then(jsonData=>{
            window.location.assign(jsonData[0].value)
          })
            .catch(error=>{
              this.props.toggleMicrophone()
              this.props.setMessage("Command not found.")
              setTimeout(function(){
                this.props.setMessage("")
              }.bind(this), 3000)
            })
          
        }).catch(error=>{
          console.log(error.stack)
          this.props.resetTranscript()
        })
      }
    }
    componentDidUpdate(){
      if(this.props.interimTranscript==='' && this.props.finalTranscript!==''){ 
        this.testTranscript()
      }
    }
  render() {
    const { browserSupportsSpeechRecognition, interimTranscript} = this.props

    if (!browserSupportsSpeechRecognition) {
      return null
    }
    return (
      <div className="transcriptContainer">
        <div className="transcript">{interimTranscript}</div>
        
      </div>
    )
  }
}

Dictaphone.propTypes = propTypes

export default SpeechRecognition(Dictaphone)