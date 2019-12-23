import { isNullOrUndefined } from 'util';

class CleanDF {
  constructor(df, xColumnName){
    if( isNullOrUndefined(df)){
      this.data = []
    }else{
      this.data = df
    }

    this.xColumnName = xColumnName
  }
  cleanData(){
    if(isNullOrUndefined(this.data)){
      return []
    }
    let lines = {}
    // Assume all columns in data are lines except for xColumnName
    // Create lines = {'columnName':[{'X':xvalue, 'Y':yvalue}, ...]}
    
    this.data.map(row => {
      Object.keys(row).forEach((key)=>{
        if (!(key == this.xColumnName) && !isNullOrUndefined(row[this.xColumnName]) && !isNaN(row[key]) && !isNullOrUndefined(row[key])){
            //Add Coordinate to Existing Line
            if (lines.hasOwnProperty(key)){
              lines[key].push({'X':row[this.xColumnName], 'Y':row[key]})
            }else{ // Add new line to lines dictionary
              lines[key] = [{'X':row[this.xColumnName], 'Y':row[key]}]
            }
        }
      })
        
    } );

    let newData = [];
  
    Object.keys(lines).forEach((col_name)=>{
      newData.push({'label': col_name, 'value':lines[col_name]});
    });

    return newData;
  }
}
export default CleanDF;