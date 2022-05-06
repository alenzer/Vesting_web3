import Web3 from 'web3'
import { BigNumber, ethers, utils } from 'ethers'
import jwt from 'jsonwebtoken'

export const getShortWalletAddress = (account: string) => {
  return `${account.slice(0, 6)}...${account.slice(-4)}`
}

export const formatEther = (amount: BigNumber, decimals: number = 18, toFixed: number, groupSeparator: boolean): string => {    
  let res
  if (toFixed>=decimals){
      res = ethers.FixedNumber.fromString(utils.formatUnits(amount, decimals)).toString()
  }else{
      let fixed=ethers.FixedNumber.fromString(utils.formatUnits(BigNumber.from(10).pow(toFixed),0))        
      res = ethers.FixedNumber.fromString(utils.formatUnits(amount, decimals-toFixed)).floor().divUnsafe(fixed).toString()
  }
  if (res.substring(res.length-2,res.length)==='.0'){
      res=res.substring(0,res.length-2)
  }
  if (groupSeparator){
      res=utils.commify(res)
  }
  
  return res
}

export const parseEther = (n: string, decimals: number = 18): BigNumber => {
  return utils.parseUnits(n, decimals)    
}

export const checkAuthentication = () => {
  const authorizationToken = localStorage.getItem('jwtToken')  
  if (authorizationToken == null) {
    return false
  }
  try {
    let token=jwt.decode(authorizationToken)
    if (token) return true
    else return false
  } catch (err) {
    return false
  }
}

export const getUserName = () => {
  return checkAuthentication() ? localStorage.getItem('username') : ''
}

export const getUserToken = () => {
  return checkAuthentication() ? localStorage.getItem('jwtToken') : ''
}

export const getShortDateTimeWithoutSeconds = (d: Date):string => {
  // return d.toLocaleString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  let res:string=d.toISOString().slice(0, 16)
  return res.split('T')[0]+'  '+res.split('T')[1]
}

export function formatTime(value: number) {
  const mins = Math.round(value / 60)
  const hours = Math.round(mins / 60)
  const days = Math.round(hours / 24)
  if (days > 0) {
    return `${days} day(s)`
  }
  if (hours > 0) {
    return `${hours} hour(s)`
  }
  if (mins > 0) {
    return `${mins} min(s)`
  }
  if (value > 0) {
    return `${value} sec(s)`
  }
  return '0 days'
}

export function parseVestingTypeData(data: string, web3: Web3) {
  const str = data.substring(data.length - (data.length - 2))
  const arrayData = str.match((/.{1,64}/g))  
  
  return {
    startTime: web3.utils.hexToNumber(`0x${arrayData?.[1]}`),
    endTime: web3.utils.hexToNumber(`0x${arrayData?.[2]}`),
    lockupDuration: web3.utils.hexToNumber(`0x${arrayData?.[3]}`),
    maxAmount: web3.utils.hexToNumberString(`0x${arrayData?.[4]}`),
    vestingFrequencyId: web3.utils.hexToNumber(`0x${arrayData?.[5]}`),
    name: web3.utils.hexToAscii(`0x${arrayData?.[7]}`).split(web3.utils.hexToAscii(`0x00`))[0],
  }
}