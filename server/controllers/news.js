const cheerio = require('cheerio')
const axios = require('axios')

async function getNSpmMentions(){
    
        try {
            const $ = cheerio.load(html)

            let objArr ={}
        
            let data = []
           
            $('article').each((i, elem)=>{
        
              if(objArr[i] == undefined){
                
                objArr[i] = {};
            }
        
              const title = $(elem).find('h3').text().replace(/\s\s+/g, '')
              const link = $(elem).find('a').attr('href')
              const time = $(elem).find('time').text().replace(/\s\s+/g, '')
        
              objArr[i].title = title
              objArr[i].link = link
              objArr[i].time = time
        
              data.push(objArr)
          
        
              return data
        
            })
        } catch (error) {
            
        }
}

exports.getnews = async(req, res, next) => {
    try {
       
        const siteurl = 'https://news.google.com/search?for=nigerian+security+printing+and+minting&hl=en-NG&gl=NG&ceid=NG%3Aen'
        const url_news = await axios({
            method: 'GET',
            url: siteurl
        })


        const $ = cheerio.load(url_news.data)
        let objArr ={} 
        let data = []

        $('article').each((i, elem)=>{    
          if(objArr[i] == undefined){
            objArr[i] = {};
        }
    
          const title = $(elem).find('h3').text().replace(/\s\s+/g, '')
          const link = $(elem).find('a').attr('href')
          const time = $(elem).find('time').text().replace(/\s\s+/g, '')
    
          objArr[i].title = title
          objArr[i].link = link
          objArr[i].time = time
    
          data.push(objArr)    
        })

        // console.log(data)
        return res.status(200).json(data)
    
    } catch (err) {
        return res.status(500).json({
            err: err.toString()
        })
    }
} 