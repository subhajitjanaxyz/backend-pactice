const storage = multer.diskStorage({

    // key:1 its define were i saved 
    destination: function (req, file, cb) {
      cb(null, './public/temp')//folder path were file saved
    },
    // key:2 its define file name  
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({storage })