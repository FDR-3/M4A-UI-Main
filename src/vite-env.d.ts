/// <reference types="vite/client"/>
declare module '*.vue'
declare module '*.ts'
declare module '*.json'

interface Window
{
    ethereum: any
    web3: any
}
