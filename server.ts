import express from "express"
import puppeteer from "puppeteer"
import fs from "fs"

const app = express()

app.get("/promo/:code/:currency/:limit/:reward.png", async (req,res)=>{

const {code,currency,limit,reward} = req.params

const total = Number(limit) * Number(reward)

let html = fs.readFileSync("template.html","utf8")

html = html
.replace("{{CODE}}",code)
.replace("{{CURRENCY}}",currency)
.replace("{{LIMIT}}",limit)
.replace("{{REWARD}}",reward)
.replace("{{TOTAL}}",total.toString())

const browser = await puppeteer.launch({
args:["--no-sandbox"]
})

const page = await browser.newPage()

await page.setViewport({width:800,height:360})

await page.setContent(html)

const buffer = await page.screenshot({
type:"png"
})

await browser.close()

res.set("Content-Type","image/png")

res.send(buffer)

})

app.listen(3000,()=>{
console.log("Server running on port 3000")
})
