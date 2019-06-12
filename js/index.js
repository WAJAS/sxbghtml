$(function() {
  var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth - 17;
  canvas.height = window.innerHeight - 17;
  ctx.lineWidth = 0.2;
  ctx.strokeStyle = new Color(150).style;
  var mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100
  };

  var dots = {
    //点的数量
    nb: wajasmax(canvas.width, canvas.height)/2,
    //线的长度
    distance: 100,
    //显示半径
    d_radius: 50,
    array: []
  };
  function wajasmax(xz, yz) {
    // if (xz > yz) {
    //   return xz;
    // }
    // return yz;
    return (xz + yz) / 2;
  }
  //获取一个0-254之间的随机数+一个数字
  function colorValue(min) {
    return Math.floor(Math.random() * 255 + min);
  }
  //得到一个透明度为.8的颜色
  function createColorStyle(r, g, b) {
    return "rgba(" + r + "," + g + "," + b + ", 0.8)";
  }

  function mixComponents(comp1, weight1, comp2, weight2) {
    return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
  }

  function averageColorStyles(dot1, dot2) {
    var color1 = dot1.color,
      color2 = dot2.color;

    var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
      g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
      b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
    return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
  }

  function Color(min) {
    min = min || 0;
    this.r = colorValue(min);
    this.g = colorValue(min);
    this.b = colorValue(min);
    this.style = createColorStyle(this.r, this.g, this.b);
  }

  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();

    this.radius = Math.random() * 2;

    this.color = new Color();
    // console.log("球的属性");
    // console.log(this);
  }

  Dot.prototype = {
    draw: function() {
      ctx.beginPath();
      ctx.fillStyle = this.color.style;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }
  };

  function createDots() {
    for (i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
    }
  }

  function moveDots() {
    //创建点
    for (i = 0; i < dots.nb; i++) {
      //数组，点
      var dot = dots.array[i];
      //如果垂直超过上限或者下限
      if (dot.y < 0 || dot.y > canvas.height) {
        dot.vx = dot.vx;
        dot.vy = -dot.vy;
      }
      //如果水平超过上限或者下限
      if (dot.x < 0 || dot.x > canvas.width) {
        dot.vx = -dot.vx;
        dot.vy = dot.vy;
      }
      dot.x += dot.vx*3;
      dot.y += dot.vy*3;
    }
  }

  function connectDots() {
    //双重循环所有数组
    for (i = 0; i < dots.nb; i++) {
      for (j = 0; j < dots.nb; j++) {
        i_dot = dots.array[i];
        j_dot = dots.array[j];
        //如果任意两个点的横坐标或者纵坐标大于 上面定义的长度
        if (
          i_dot.x - j_dot.x < dots.distance &&
          i_dot.y - j_dot.y < dots.distance &&
          i_dot.x - j_dot.x > -dots.distance &&
          i_dot.y - j_dot.y > -dots.distance
        ) {
          //横坐标减去鼠标横方向，小于半径
          if (
            i_dot.x - mousePosition.x < dots.d_radius &&
            i_dot.y - mousePosition.y < dots.d_radius &&
            i_dot.x - mousePosition.x > -dots.d_radius &&
            i_dot.y - mousePosition.y > -dots.d_radius
          ) {
            ctx.beginPath();
            ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
            ctx.moveTo(i_dot.x, i_dot.y);
            ctx.lineTo(j_dot.x, j_dot.y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }
  }

  function drawDots() {
    for (i = 0; i < dots.nb; i++) {
      var dot = dots.array[i];
      dot.draw();
    }
  }

  function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveDots();
    connectDots();
    drawDots();
    requestAnimationFrame(animateDots);
  }
  //获取鼠标位置
  $("canvas").on("mousemove", function(e) {
    mousePosition.x = e.pageX;
    mousePosition.y = e.pageY;
  });
  //没有鼠标时，将鼠标定在画板中间
//   $("canvas").on("mouseleave", function(e) {
//     mousePosition.x = canvas.width / 2;
//     mousePosition.y = canvas.height / 2;
//   });

  createDots();
  requestAnimationFrame(animateDots);
});
