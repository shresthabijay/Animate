import React, { Component } from 'react';
import {Animated} from "react-animated-css"

class DelayedUnMount extends Component{
  constructor(props) {
    super(props);
    this.state={shouldRender:this.props.isMounted}
  }  

  componentDidUpdate=(prevProps)=>{
    if (prevProps.isMounted && !this.props.isMounted) {
      setTimeout(
        () => this.setState({ shouldRender: false }),
        this.props.delayTime
      );
    } else if (!prevProps.isMounted && this.props.isMounted) {
      this.setState({ shouldRender: true });
    }
  }

  render() {
    return this.state.shouldRender ?this.props.children: null;
  }
}


export default class Animate extends Component{

  constructor(props) {
    super(props)
    this.state = {animating:false,animationType:"",toogleStatic:this.props.toogleStatic,isChildMounted:false};
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    
    if(!prevState.isChildMounted && nextProps.isMounted && nextProps.animationIn){
      console.log("mount")
      return{isChildMounted:true,animationType:"mount",animating:true}
    }
    else if(prevState.isChildMounted && !nextProps.isMounted && nextProps.animationOut){
        console.log("unmount")
      return{isChildMounted:false,animationType:"unmount",animating:true}
    }
    else if(prevState.toogleStatic !== nextProps.toogleStatic && nextProps.staticAnimation && nextProps.isMounted && !nextProps.infinite){
        return{animationType:"static",animating:true,toogleStatic:nextProps.toogleStatic}
    }
    

    
    else{return{}}
  }
  
  onAnimationCompletion=()=>{

    if(this.state.animationType==="mount"){
      if(this.props.triggerAfterMount){
        this.props.triggerAfterMount()
      }
      if(this.props.infinite){
        this.setState({animationType:"static",animating:true})
        return
      }
    }
    else if(this.props.triggerAfterUnMount && this.state.animationType==="unmount"){
        this.props.triggerAfterUnMount
    }
    else if(this.props.triggerAfterStatic && this.state.animationType==="static"){
        this.props.triggerAfterStatic
    }
    this.setState({animating:false,animationType:""})
  }

  render(){

    console.log("render")
    let animationName;
    
    if(this.state.animationType==="mount" && this.props.animationIn){
      animationName=this.props.animationIn
    }
    else if(this.state.animationType==="unmount" && this.props.animationOut){
      animationName=this.props.animationOut
    }
    else if(this.state.animationType==="static" && this.props.staticAnimation){
      animationName=this.props.staticAnimation
    }

    return(
      <div   
      style={this.props.style}
      className={`animated  ${this.state.animating?animationName:""}`}
      onClick={this.props.onClick}
      onAnimationEnd={this.onAnimationCompletion}
      >
            {<DelayedUnMount afterMountHandler={this.childrenDidMount} isMounted={this.state.isChildMounted}  delayTime={this.props.delayTime}>
              {this.props.children}
            </DelayedUnMount>}
      </div>
    )
  }
}
