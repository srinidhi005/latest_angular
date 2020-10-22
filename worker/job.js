var path = require('path')
var fs = require('fs');
const exec = require("child_process").exec;
const kue = require('kue');
var redis = require("redis");
var rimraf = require("rimraf");
var db = require('../models');

const {Storage} = require('@google-cloud/storage');

const log = require('simple-node-logger').createSimpleLogger('proj.log');
const storage = new Storage();

client = redis.createClient();

let queue = kue.createQueue();

queue.process('pdf', function(job, done)
{
   // console.log("before folder creation",job.id)
//log.info("level1");
    var jobId = job.id;
    client.set('q:job:'+job.id, JSON.stringify(job.data));
  //  console.log(job.data)
//	log.info(job.data,"level2")
    var cmd;
    var companyName = job.data.company.replace(/ /g, '_')   
	var statementtype=job.data.statementtype.replace(/ /g, '_')
	var industry=job.data.industry.replace(/ /g,'')
	var filename=job.data.filename
    var folderName = companyName + '-' + (job.data.period || 'N');
    if (job.data.filename.indexOf('.pdf') != -1) {
	    //console.log("foldername",folderName)
	    //log.info("level3")
	    console.log("statementtype",statementtype)
	    console.log("industry",industry)
	    console.log("filename",filename)
	    console.log("companyname",companyName)

        //cmd += job.data.path + ' ' + '/home/srinidhi/angular/output/' + ' ' + '/home/srinidhi/angular/extractor/pdf' +' '+companyName;
      // cmd = 'sudo python3.7 /home/srinidhi/angular/extractor/txt_conversion.py '+'gs://extraction-engine/'+filename;
//workingUPLOADING
cmd='sudo python3.7 /home/srinidhi/angular/extractor/upload.py'+' '+'/home/srinidhi/angular/ExtractedFiles/'+filename+' '+companyName+'/'+filename; 
cmd1 ='sudo python3.7 /home/srinidhi/angular/extractor/txt_conversion.py'+' '+'gs://sample_pdf/'+companyName+'/'+filename;
//cmd2 ='sudo python3.7 /home/srinidhi/angular/extractor/pdf_automl_txt.py'+' '+'gs://sample_pdf/'+companyName+'/'+filename+' '+'projects/410058770032/locations/us-central1/models/TEN7257975210995875840';
//cmdv='sudo python3.7 /home/srinidhi/angular/extractor/vision.py'+' '+'gs://sample_pdf/'+companyName+'/'+filename;

cmd2 ='sudo python3.7 /home/srinidhi/angular/extractor/automl_pdf_extractor_retail.py'+' '+'gs://sample_pdf/'+companyName+'/'+filename+' '+'projects/410058770032/locations/us-central1/models/TEN8689222691011428352'+' '+companyName +' '+job.data.period+' '+'admin'+' '+industry+' '+statementtype+' '+filename;
	    //          cmd = 'sudo python3 /home/srinidhi/angular/extractor/PDF_Extractor_Retail.py '+job.data.path +' '+companyName +' '+'Y admin Consumer_Retail all_statements'; 
	 //   cmd = 'sudo python3 /home/srinidhi/angular/extractor/PDF_Extractor_Retail.py '+job.data.path +' '+companyName +' '+job.data.period+' '+'admin'+' '+industry+' ' +statementtype; 
	    //cmd = 'sudo python3 /home/srinidhi/angular/extractor/PDF_Extractor_Retail.py/';
	//	   cmd +=job.data.path+' '+companyName+'Y  admin Consumer_Retail all_statements'; 
console.log("level0-->",cmd)	
console.log("level1--->",cmd1)
//console.log("level2---->",cmdv)	
console.log("level3-->",cmd2)
    } else if (job.data.filename.indexOf('.csv') != -1) {
        cmd = 'python3 extractor/csv-excel/mapping.py ';
        cmd += job.data.path + ' ' + './output/' + folderName + '/file' + ' ' + 'extractor/csv-excel';
    } else if (job.data.filename.indexOf('.xlsx') != -1) {
        var csvFile = job.data.originalname.replace('.xlsx', '.csv')
        cmd = 'python3 extractor/csv-excel/mapping.py ';
        cmd += job.data.path + ' ' + './output/' + folderName + '/file' + ' ' + 'extractor/csv-excel' + ' ' + csvFile;
    }
    //console.log(cmd2)
	//console.log("job created == by us")
    var files = [
        path.join(__dirname, '../output', folderName, 'file0.json'),
        path.join(__dirname, '../output', folderName, 'file1.json'),
        path.join(__dirname, '../output', folderName, 'file2.json'),
        path.join(__dirname, '../output', folderName, 'file3.json')
    ];
    exec(cmd, async (err, stdOut, stdErr) => {
        if (err) {
            console.log('------------------err')
            console.log(err)
            db.statement.update({status: 'Error'}, {where: {id: job.data.statementId}})
            .then(() => {
                done();
            })
        } else {
            var promises = [];
            files.forEach((el, index) => {    
                if (fs.existsSync(el)) {
                    promises.push(storage.bucket('extraction-engine').upload(el, {
                        destination: folderName + '/file' + index + '.json',
                    }));
                }
            })
            if (promises) {
                Promise.all(promises).then(() => {
                    var items = fs.readdirSync('output');
                    var status = items.length == 3 ? 'Extracted' : 'Error';
                    //rimraf.sync(path.join(__dirname, '../output', companyName));
                    return db.statement.update({status: status}, {where: {id: job.data.statementId}});
                }).then(() => { 
                    client.get('q:job:'+jobId, function(err, reply) {
                        var jobData = JSON.parse(reply);
                        jobData = Object.assign({}, jobData, {status: 'COMPLETED'});
                        client.set('q:job:'+jobId, JSON.stringify(jobData));
                        console.log('job completed successfully')
                        //if (fs.existsSync(job.data.path)) {
                         //  fs.unlinkSync(job.data.path);
                        //}
                        done();
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
		   exec(cmd1, async (err, stdOut, stdErr) => {
			                    if (err) {
						    console.log('------------------cmd1 err')
						                    } else {
									                        console.log('cmd1 success')
									                    }
			                });
                             
                              
                                                      
                                                                          
                            
                  setTimeout(function(){exec(cmd2, async (err, stdOut, stdErr) => {
                                            if (err) {
                                                    console.log('------------------cmd2 err')
							console.log('error with cmd2',err)
                                                                    } else {
                                                                                                console.log('cmd2 success')
                                                                                            }
                                        })},9000);      }
    })
 })

//console.log('job started')
