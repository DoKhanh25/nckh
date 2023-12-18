function toZeroWidth(s) {
    // Trim spaces across edges
    s = s.trim();
  
    // Split to words separated by space
    const words = s.split(' ');
    
    const zwWords = [];
    for (const w of words) {
      zwWords.push(convertWord(w));
    }
    // Join each word by zero-width no break
    return zwWords.join('\uFEFF');
}
function convertWord(s) {
    const bits = toBits(s);
    
    const zws = [];
  
    for (const b of bits) {
      zws.push(convertLetter(b));
    }
   
    // Join each letter by zero-width joiner
    return zws.join('\u200D');
}
function toBits(s) {
    const bits = [];
    for (const c of s) {
      bits.push(c.charCodeAt().toString(2));
    }
  
    return bits;
  }
  
function convertLetter(s) {
    
    let sb = '';
    for (const c of s) {
      if (c === '0') {

        sb += '\u200C';
        continue;
      }
  
      sb += '\u200B';
    }
    return sb;
}

function separate(s) {
    const pt = [];
    const zw = [];
  
    for (const c of s) {
      switch (c) {
        case '\uFEFF':
        case '\u200B':
        case '\u200D':
        case '\u200C':
          zw.push(c);
          break;
        default:
          pt.push(c);
      }
    }
  
    return [pt, zw];
  }

function constructLetter(zws) {
    let binaryString = '';
  
    for (const r of zws) {
      switch (r) {
        case '\u200B':
          binaryString += '1';
          break;
        case '\u200C':
          binaryString += '0';
          break;
      }
    }
  
    const n = parseInt(binaryString, 2);
  
    if (Number.isNaN(n)) {
      throw new Error(`Failed to convert ${zws} to letter`);
    }
    return String.fromCharCode(n);
}
  
function constructKey(zws) {
    let key = '';
    let cl = [];
  
    for (const r of zws) {
      switch (r) {
        case '\u200D':
        case '\uFEFF':
          const dr = constructLetter(cl);
          key += dr;
          cl = [];
  
          if (r === '\uFEFF') {
            key += ' ';
          }
          break;
        default:
          cl.push(r);
      }
    }
  
    if (cl.length > 0) {
      const r = constructLetter(cl);
      if (!Number.isNaN(r)) {
        key += r;
      }
    }
  
    return key;
}

class WaterMarking  {
     Embed = (data, key) => {
        // Convert key to zero-width characters
        const zwKey = toZeroWidth(key);
      
        // Initialize variables
        let t = 0;
        let embed = [];
      
        // Iterate through data string
        for (let i = 0; i < data.length; i++) {
          const c = data[i];
      
          // Add first character to embed array
          if (i === 0) {
            embed.push(c);
          }
      
          // Embed key characters
          if (t < zwKey.length) {
            embed.push(zwKey[t]);
            t++;
          }
      
          // Add non-first characters to embed array
          if (i !== 0) {
            embed.push(c);
          }
        }
      
        // Handle remaining key characters
        if (t < zwKey.length) {
          if (embed.length > 0) {
            const lb = embed[embed.length - 1];
            embed = embed.slice(0, embed.length - 1);
            embed.push(...zwKey.slice(t));
            embed.push(lb);
          } else {
            embed.push(...zwKey.slice(t));
        }
    }
        return embed.join('');
    }

    Extract =  (embed) => {
        const [pr, zws] = separate(embed);
        const key = constructKey(zws);
        return { plainText: pr.join(''), key };
      }
}

const waterMarking = new WaterMarking()
module.exports = waterMarking;