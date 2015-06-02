// inspired by @olegcherr. https://github.com/olegcherr/Reedy-for-Chrome

module.exports = {
  norm(num, min, max) {
    return num > max ? max : num < min ? min : num;
  },

  roundExp(num) {
    var pow = Math.pow(10, (num + '').length - 1);
    return Math.round(num / pow) * pow;
  },

  htmlEncode(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },

  flatten(array) {
    var res = [];

    (function flat(arr) {
      if (toString.call(arr) === '[object Array]') {
        arr.forEach(flat);
      } else {
        res.push(arr);
      }
    })(array);

    return res;
  },

  cleanUpTextSimple(raw) {
    var sign = '~NL' + (+(new Date()) + '').slice(-5) + 'NL~';
    return raw
      .trim()
      .replace(/\n|\r/gm, sign)
      .replace(/\s+/g, ' ')
      .replace(new RegExp('\\s*' + sign + '\\s*', 'g'), sign) // `      \n    `
      .replace(new RegExp(sign, 'g'), '\n');
  },

  cleanUpTextAdvanced(raw) {
    var NL = '~NL' + (+(new Date()) + '').slice(-5) + 'NL~';
    return raw
      .trim()
      .replace(/\n|\r/gm, NL)
      .replace(/\s+/g, ' ')
      .replace(new RegExp('\\s*' + NL + '\\s*', 'g'), NL) // `      \n    `
      .replace(/‐/g, '-') // short dash will be replaced with minus
      .replace(/ \- /g, ' — ') // replace minus between words with em dash
      .replace(/–|−|―/g, '—') // there are 5 dash types. after the cleaning only 2 will remain: minus and em dash
      .replace(/[-|—]{2,}/g, '—') // `--` | `------`
      .replace(new RegExp('( |^|' + NL + ')([([«]+) ', 'g'), '$1$2') // `сюжет ( видео`
      .replace(new RegExp(' ([)\\].,!?;»]+)( |$|' + NL + ')', 'g'), '$1$2') // `вставка ) отличный` | `конечно ...` | ` , ` | ` .\n`
      .replace(/\.{4,}/g, '...') // `.......`
      .replace(/([!?]{3})[!?]+/g, '$1') // `неужели!!!!!???!!?!?`
      .replace(new RegExp(NL, 'g'), '\n');
  }

}
