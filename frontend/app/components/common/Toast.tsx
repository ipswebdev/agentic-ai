import { useState } from "react";

export default function Toast({message,status,onClose}){

    const bgClass =
    status === "INFO"
        ? "bg-green-500"
        : status === "WARN"
        ? "bg-yellow-500"
        : status === "ERROR"
        ? "bg-red-500"
        : "bg-gray-500";
    const el = <div className={`fixed
    top-6
    right-6
    z-50
    flex
    items-center
    justify-between
    gap-4
    min-w-[320px]
    max-w-md
    rounded-lg
    px-4
    py-3
    shadow-xl
    text-white
    ${bgClass}`}>{message} <button  className="
        text-lg
        font-semibold
        opacity-80
        hover:opacity-100
        transition
    " onClick={()=>onClose()}>x</button></div>
    return (el)
}