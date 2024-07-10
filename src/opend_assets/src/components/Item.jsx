import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from '@dfinity/agent';
import { idlFactory } from "../../../declarations/NFT";
import { idlFactory  as tokenIdlFactory} from "../../../declarations/token";
import {Principal} from "@dfinity/principal";
import Button from "./Button";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const [name,setName]=useState();
  const [owner,setOwner]=useState();
  const [image,setImage]=useState();
  const [button,setButton]=useState();
  const [priceInput,setPriceInput]=useState();
  const [hiddenloader,sethiddenloader]=useState(true);
  const [blur,setBlur]=useState();
  const [sellStatus,setsellStatus]=useState("");
  const [pricelabel,setPricelabel]=useState();
  const [shouldDisplay,setShouldDisplay]=useState(true);
  const id=props.id;
  const localhost="http://localhost:8080/";
  const agent=new HttpAgent({host: localhost});

  agent.fetchRootKey();

  let NFTActor;
  async function loadNFT(){
    NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getname();
    setName(name);

    const owner = await NFTActor.getOwner();
    setOwner(owner.toText());

    const imgdata = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imgdata);
    const image = URL.createObjectURL(new Blob([imageContent.buffer],{type:"image/png"}));
    setImage(image);

    
    if(props.role=="collection"){
      const nftListed = await opend.isListed(props.id);
      if(nftListed){
        setOwner("Opend");
        setBlur({filter:"blur(3px)"});
        setsellStatus("Listed");
      }else{
        setButton(<Button handleClick={handleSell} text="sell"/>);
      }
    }else if(props.role=="discover"){
      const originalowner = await opend.getOriginalOwner(props.id);
      if(originalowner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={handleBuy} text="Buy"/>);
      }

      const sellprice= await opend.getsellPrice(props.id)
      setPricelabel(<PriceLabel price={sellprice.toString()}/>)
    }

    
  }

  useEffect(()=>{
    loadNFT();
  },[])

  let price;
  async function handleBuy(){
    sethiddenloader(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory,{
      agent,
      canisterId: Principal.fromText("w6ozc-gaaaa-aaaaa-aaarq-cai"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getsellPrice(props.id);

    const sellResult = await tokenActor.transfer(sellerId,itemPrice);
    console.log("sell status:"+sellResult);

    if(sellResult == "Success"){
     const result= await opend.completePurchase(props.id,sellerId,CURRENT_USER_ID);
     console.log("purchase:"+result);
     sethiddenloader(true);
     setShouldDisplay(false);
    }else{
      sethiddenloader(true);
      setButton(<Button handleClick={handleBuy} text="Insufficient funds!Try again"/>);
    }
  }
  

  function handleSell(){
    console.log("sell cloicked");
    setPriceInput(<input
      placeholder="Price in DSUR"
      type="number"
      className="price-input"
      value={price}
      onChange={(e)=> price=e.target.value}
    />)
    setButton(<Button handleClick={sellItem} text={"Confirm"}/>);
  }
  async function sellItem(){
    // console.log("set price:"+ price);
    setBlur({filter:"blur(3px)"})
    sethiddenloader(false);
    const lisitingresult=await opend.listItem(props.id,Number(price));
    console.log("listing:"+lisitingresult);
    if(lisitingresult == "sucess"){
      const opendId=await opend.getOpendCanisterId();
      const transferResult=await NFTActor.transferOwnership(opendId);
      console.log("transfer :"+transferResult);
      if(transferResult=="success"){
        sethiddenloader(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setsellStatus("Listed");
      }
      
    }

  }
  return (
    <div style={{display : shouldDisplay ? "inline": "none"}}className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image} style={blur}
        />
        <div hidden={hiddenloader} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
        {pricelabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner} 
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
