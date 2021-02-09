export default {
  // 判断是否为DOM
  isDOM(item) {
    // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是DOM节点，特征使用的越多越准确
    return typeof HTMLElement === 'function'
      ? item instanceof HTMLElement
      : item && typeof item === 'object' && item.nodeType === 1 && typeof item.nodeName === 'string';
  },

  /**
   * 计算各个元素的总高度
   * @param {string[]|HTMLElement[]} elemArr 所需计算总高度的元素的`attrName`，包括类名/id等，或者HTMLElement
   * @return {number} 各个元素的总高度
   */
  calcElemsOffsetHeight(elemArr) {
    let offsetHeight = 0;
    if (elemArr && Array.isArray(elemArr) && elemArr.length) {
      elemArr.forEach(item => {
        let elem;
        if (typeof item === 'string') {
          elem = document.querySelector(item);
        } else {
          if (this.isDOM(item)) {
            elem = item;
          } else {
            elem = null;
          }
        }
        elem && (offsetHeight += elem.offsetHeight);
      });
    }
    return offsetHeight;
  },

  /**
   * 计算元素的滚动高度
   * @param {string[]|HTMLElement[]} addElems 所需计算总高度的元素的`attrName`，包括类名/id等，或者HTMLElement
   * @param {string[]|HTMLElement[]} reduceElems 所需计算减去高度的元素的`attrName`，包括类名/id等，或者HTMLElement
   * @param {any} elemsStyles 需要计算的元素的样式, 格式：
   * {
   *      attrName: [`styleTypes|calc`]
   * }
   * styleTypes同react中的style, calc为加减`[+]|-`符号, 其中省略则默认为+，用于计算.
   * @example { `#main_body`: ['paddingTop|-', 'paddingBottom|+', 'marginTop'] }
   * @param {number[]} otherCounts 其它需要计算的数值
   * @return 高度值
   */
  calcScrollHeight(addElems, reduceElems, elemsStyles, otherCounts) {
    let offsetHeight = 0;

    offsetHeight += this.calcElemsOffsetHeight(addElems);
    offsetHeight -= this.calcElemsOffsetHeight(reduceElems);

    if (elemsStyles && Object.keys(elemsStyles).length) {
      Object.keys(elemsStyles).forEach(attrName => {
        let elem = document.querySelector(attrName);
        if (elem) {
          let styleTypes = elemsStyles[attrName];
          let styles = getComputedStyle(elem);
          styleTypes.forEach(item => {
            let [type, calc] = item.split('|');
            let val = parseFloat(styles.getPropertyValue(type)),
              // let val = parseInt(styles[type]),
              e = calc === '-' ? -1 : 1;
            val && (offsetHeight += val * e);
          });
        }
      });
    }

    if (otherCounts && otherCounts.length) {
      otherCounts.forEach(val => {
        offsetHeight += val;
      });
    }

    return offsetHeight;
  },
};
