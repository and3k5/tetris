// ------------------------- BRICK -------------------------
describe("Brick", function() {
  var brick;

  beforeEach(function() {
    brick = new Brick();
  });

  it("should rotate", function() {
    var models = [  [[1,0],[1,0]],
					[[1,1],[0,0]],
					[[0,1],[0,1]],
					[[0,0],[1,1]]	];
	
	
	for (var i=0;i<4;i++) {
		brick.blocks = models[i].concat();
		
		brick.rotate();

		expect(brick).toMatch(models[(i+1)%4].concat());
	}
  });
});

beforeEach(function () {
  jasmine.addMatchers({
    toMatch: function () {
      return {
        compare: function (actual, blocks) {
          var brick = actual;

		  var rtn=true;
		  
		  for (var i=0,len=brick.blocks.length;i<len;i++) {
			  for (var j=0,len2 = brick.blocks[i].length;j<len2;j++) {
				  if (brick.blocks[i][j]!=blocks[i][j]) rtn = false;
			  }
		  }
		  
          return {
            pass: rtn
          }
        }
      };
    }
  });
});

// ------------------------- COLOR -------------------------
describe("Color", function() {
  var color;

  beforeEach(function() {
    color = new Color();
  });

  it("adding feature", function() {
	
  });
});
