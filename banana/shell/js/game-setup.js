
var window = {
  location: {
    toString: function() {
      return 'game.html?low,low,reproduce=repro.data';
    },
    search: '?low,low,reproduce=repro.data',
  },
  fakeNow: 0, // we don't use Date.now()
  rafs: [],
  timeouts: [],
  uid: 0,
  requestAnimationFrame: function(func) {
    func.uid = window.uid++;
    print('adding raf ' + func.uid);
    window.rafs.push(func);
  },
  setTimeout: function(func, ms) {
    func.uid = window.uid++;
    print('adding timeout ' + func.uid);
    window.timeouts.push({
      func: func,
      when: window.fakeNow + (ms || 0)
    });
    window.timeouts.sort(function(x, y) { return y.when - x.when });
  },
  onIdle: function(){ print('triggering click'); document.querySelector('.fullscreen-button.low-res').callEventListeners('click'); window.onIdle = null; },
  runEventLoop: function() {
    // run forever until an exception stops this replay
    var iter = 0;
    while (1) {
      var start = Recorder.dnow();
      print('event loop: ' + (iter++));
      if (window.rafs.length == 0 && window.timeouts.length == 0) {
        if (window.onIdle) {
          window.onIdle();
        } else {
          throw 'main loop is idle!';
        }
      }
      // rafs
      var currRafs = window.rafs;
      window.rafs = [];
      for (var i = 0; i < currRafs.length; i++) {
        var raf = currRafs[i];
        print('calling raf: ' + raf.uid);// + ': ' + raf.toString().substring(0, 50));
        raf();
      }
      // timeouts
      var now = window.fakeNow;
      var timeouts = window.timeouts;
      window.timeouts = [];
      while (timeouts.length && timeouts[timeouts.length-1].when <= now) {
        var timeout = timeouts.pop();
        print('calling timeout: ' + timeout.func.uid);// + ': ' + timeout.func.toString().substring(0, 50));
        timeout.func();
      }
      // increment 'time'
      window.fakeNow += 16.666;
      print('main event loop iteration took ' + (Recorder.dnow() - start) + ' ms');
    }
  },
  URL: {
    createObjectURL: function(x) {
      return x; // the blob itself is returned
    },
    revokeObjectURL: function(x) {},
  },
};
var setTimeout = window.setTimeout;
var document = {
  eventListeners: {},
  addEventListener: function(id, func) {
    var listeners = this.eventListeners[id];
    if (!listeners) {
      listeners = this.eventListeners[id] = [];
    }
    listeners.push(func);
  },
  callEventListeners: function(id) {
    var listeners = this.eventListeners[id];
    if (listeners) {
      listeners.forEach(function(listener) { listener() });
    }
  },
  getElementById: function(id) {
    switch(id) {
      case 'canvas': {
        if (this.canvas) return this.canvas;
        return this.canvas = {
          getContext: function(which) {
            switch(which) {
              case 'experimental-webgl': {
                return {
                  /* ClearBufferMask */
                  DEPTH_BUFFER_BIT               : 0x00000100,
                  STENCIL_BUFFER_BIT             : 0x00000400,
                  COLOR_BUFFER_BIT               : 0x00004000,
                  
                  /* BeginMode */
                  POINTS                         : 0x0000,
                  LINES                          : 0x0001,
                  LINE_LOOP                      : 0x0002,
                  LINE_STRIP                     : 0x0003,
                  TRIANGLES                      : 0x0004,
                  TRIANGLE_STRIP                 : 0x0005,
                  TRIANGLE_FAN                   : 0x0006,
                  
                  /* AlphaFunction (not supported in ES20) */
                  /*      NEVER */
                  /*      LESS */
                  /*      EQUAL */
                  /*      LEQUAL */
                  /*      GREATER */
                  /*      NOTEQUAL */
                  /*      GEQUAL */
                  /*      ALWAYS */
                  
                  /* BlendingFactorDest */
                  ZERO                           : 0,
                  ONE                            : 1,
                  SRC_COLOR                      : 0x0300,
                  ONE_MINUS_SRC_COLOR            : 0x0301,
                  SRC_ALPHA                      : 0x0302,
                  ONE_MINUS_SRC_ALPHA            : 0x0303,
                  DST_ALPHA                      : 0x0304,
                  ONE_MINUS_DST_ALPHA            : 0x0305,
                  
                  /* BlendingFactorSrc */
                  /*      ZERO */
                  /*      ONE */
                  DST_COLOR                      : 0x0306,
                  ONE_MINUS_DST_COLOR            : 0x0307,
                  SRC_ALPHA_SATURATE             : 0x0308,
                  /*      SRC_ALPHA */
                  /*      ONE_MINUS_SRC_ALPHA */
                  /*      DST_ALPHA */
                  /*      ONE_MINUS_DST_ALPHA */
                  
                  /* BlendEquationSeparate */
                  FUNC_ADD                       : 0x8006,
                  BLEND_EQUATION                 : 0x8009,
                  BLEND_EQUATION_RGB             : 0x8009,   /* same as BLEND_EQUATION */
                  BLEND_EQUATION_ALPHA           : 0x883D,
                  
                  /* BlendSubtract */
                  FUNC_SUBTRACT                  : 0x800A,
                  FUNC_REVERSE_SUBTRACT          : 0x800B,
                  
                  /* Separate Blend Functions */
                  BLEND_DST_RGB                  : 0x80C8,
                  BLEND_SRC_RGB                  : 0x80C9,
                  BLEND_DST_ALPHA                : 0x80CA,
                  BLEND_SRC_ALPHA                : 0x80CB,
                  CONSTANT_COLOR                 : 0x8001,
                  ONE_MINUS_CONSTANT_COLOR       : 0x8002,
                  CONSTANT_ALPHA                 : 0x8003,
                  ONE_MINUS_CONSTANT_ALPHA       : 0x8004,
                  BLEND_COLOR                    : 0x8005,
                  
                  /* Buffer Objects */
                  ARRAY_BUFFER                   : 0x8892,
                  ELEMENT_ARRAY_BUFFER           : 0x8893,
                  ARRAY_BUFFER_BINDING           : 0x8894,
                  ELEMENT_ARRAY_BUFFER_BINDING   : 0x8895,
                  
                  STREAM_DRAW                    : 0x88E0,
                  STATIC_DRAW                    : 0x88E4,
                  DYNAMIC_DRAW                   : 0x88E8,
                  
                  BUFFER_SIZE                    : 0x8764,
                  BUFFER_USAGE                   : 0x8765,
                  
                  CURRENT_VERTEX_ATTRIB          : 0x8626,
                  
                  /* CullFaceMode */
                  FRONT                          : 0x0404,
                  BACK                           : 0x0405,
                  FRONT_AND_BACK                 : 0x0408,
                  
                  /* DepthFunction */
                  /*      NEVER */
                  /*      LESS */
                  /*      EQUAL */
                  /*      LEQUAL */
                  /*      GREATER */
                  /*      NOTEQUAL */
                  /*      GEQUAL */
                  /*      ALWAYS */
                  
                  /* EnableCap */
                  /* TEXTURE_2D */
                  CULL_FACE                      : 0x0B44,
                  BLEND                          : 0x0BE2,
                  DITHER                         : 0x0BD0,
                  STENCIL_TEST                   : 0x0B90,
                  DEPTH_TEST                     : 0x0B71,
                  SCISSOR_TEST                   : 0x0C11,
                  POLYGON_OFFSET_FILL            : 0x8037,
                  SAMPLE_ALPHA_TO_COVERAGE       : 0x809E,
                  SAMPLE_COVERAGE                : 0x80A0,
                  
                  /* ErrorCode */
                  NO_ERROR                       : 0,
                  INVALID_ENUM                   : 0x0500,
                  INVALID_VALUE                  : 0x0501,
                  INVALID_OPERATION              : 0x0502,
                  OUT_OF_MEMORY                  : 0x0505,
                  
                  /* FrontFaceDirection */
                  CW                             : 0x0900,
                  CCW                            : 0x0901,
                  
                  /* GetPName */
                  LINE_WIDTH                     : 0x0B21,
                  ALIASED_POINT_SIZE_RANGE       : 0x846D,
                  ALIASED_LINE_WIDTH_RANGE       : 0x846E,
                  CULL_FACE_MODE                 : 0x0B45,
                  FRONT_FACE                     : 0x0B46,
                  DEPTH_RANGE                    : 0x0B70,
                  DEPTH_WRITEMASK                : 0x0B72,
                  DEPTH_CLEAR_VALUE              : 0x0B73,
                  DEPTH_FUNC                     : 0x0B74,
                  STENCIL_CLEAR_VALUE            : 0x0B91,
                  STENCIL_FUNC                   : 0x0B92,
                  STENCIL_FAIL                   : 0x0B94,
                  STENCIL_PASS_DEPTH_FAIL        : 0x0B95,
                  STENCIL_PASS_DEPTH_PASS        : 0x0B96,
                  STENCIL_REF                    : 0x0B97,
                  STENCIL_VALUE_MASK             : 0x0B93,
                  STENCIL_WRITEMASK              : 0x0B98,
                  STENCIL_BACK_FUNC              : 0x8800,
                  STENCIL_BACK_FAIL              : 0x8801,
                  STENCIL_BACK_PASS_DEPTH_FAIL   : 0x8802,
                  STENCIL_BACK_PASS_DEPTH_PASS   : 0x8803,
                  STENCIL_BACK_REF               : 0x8CA3,
                  STENCIL_BACK_VALUE_MASK        : 0x8CA4,
                  STENCIL_BACK_WRITEMASK         : 0x8CA5,
                  VIEWPORT                       : 0x0BA2,
                  SCISSOR_BOX                    : 0x0C10,
                  /*      SCISSOR_TEST */
                  COLOR_CLEAR_VALUE              : 0x0C22,
                  COLOR_WRITEMASK                : 0x0C23,
                  UNPACK_ALIGNMENT               : 0x0CF5,
                  PACK_ALIGNMENT                 : 0x0D05,
                  MAX_TEXTURE_SIZE               : 0x0D33,
                  MAX_VIEWPORT_DIMS              : 0x0D3A,
                  SUBPIXEL_BITS                  : 0x0D50,
                  RED_BITS                       : 0x0D52,
                  GREEN_BITS                     : 0x0D53,
                  BLUE_BITS                      : 0x0D54,
                  ALPHA_BITS                     : 0x0D55,
                  DEPTH_BITS                     : 0x0D56,
                  STENCIL_BITS                   : 0x0D57,
                  POLYGON_OFFSET_UNITS           : 0x2A00,
                  /*      POLYGON_OFFSET_FILL */
                  POLYGON_OFFSET_FACTOR          : 0x8038,
                  TEXTURE_BINDING_2D             : 0x8069,
                  SAMPLE_BUFFERS                 : 0x80A8,
                  SAMPLES                        : 0x80A9,
                  SAMPLE_COVERAGE_VALUE          : 0x80AA,
                  SAMPLE_COVERAGE_INVERT         : 0x80AB,
                  
                  /* GetTextureParameter */
                  /*      TEXTURE_MAG_FILTER */
                  /*      TEXTURE_MIN_FILTER */
                  /*      TEXTURE_WRAP_S */
                  /*      TEXTURE_WRAP_T */
                  
                  COMPRESSED_TEXTURE_FORMATS     : 0x86A3,
                  
                  /* HintMode */
                  DONT_CARE                      : 0x1100,
                  FASTEST                        : 0x1101,
                  NICEST                         : 0x1102,
                  
                  /* HintTarget */
                  GENERATE_MIPMAP_HINT            : 0x8192,
                  
                  /* DataType */
                  BYTE                           : 0x1400,
                  UNSIGNED_BYTE                  : 0x1401,
                  SHORT                          : 0x1402,
                  UNSIGNED_SHORT                 : 0x1403,
                  INT                            : 0x1404,
                  UNSIGNED_INT                   : 0x1405,
                  FLOAT                          : 0x1406,
                  
                  /* PixelFormat */
                  DEPTH_COMPONENT                : 0x1902,
                  ALPHA                          : 0x1906,
                  RGB                            : 0x1907,
                  RGBA                           : 0x1908,
                  LUMINANCE                      : 0x1909,
                  LUMINANCE_ALPHA                : 0x190A,
                  
                  /* PixelType */
                  /*      UNSIGNED_BYTE */
                  UNSIGNED_SHORT_4_4_4_4         : 0x8033,
                  UNSIGNED_SHORT_5_5_5_1         : 0x8034,
                  UNSIGNED_SHORT_5_6_5           : 0x8363,
                  
                  /* Shaders */
                  FRAGMENT_SHADER                  : 0x8B30,
                  VERTEX_SHADER                    : 0x8B31,
                  MAX_VERTEX_ATTRIBS               : 0x8869,
                  MAX_VERTEX_UNIFORM_VECTORS       : 0x8DFB,
                  MAX_VARYING_VECTORS              : 0x8DFC,
                  MAX_COMBINED_TEXTURE_IMAGE_UNITS : 0x8B4D,
                  MAX_VERTEX_TEXTURE_IMAGE_UNITS   : 0x8B4C,
                  MAX_TEXTURE_IMAGE_UNITS          : 0x8872,
                  MAX_FRAGMENT_UNIFORM_VECTORS     : 0x8DFD,
                  SHADER_TYPE                      : 0x8B4F,
                  DELETE_STATUS                    : 0x8B80,
                  LINK_STATUS                      : 0x8B82,
                  VALIDATE_STATUS                  : 0x8B83,
                  ATTACHED_SHADERS                 : 0x8B85,
                  ACTIVE_UNIFORMS                  : 0x8B86,
                  ACTIVE_ATTRIBUTES                : 0x8B89,
                  SHADING_LANGUAGE_VERSION         : 0x8B8C,
                  CURRENT_PROGRAM                  : 0x8B8D,
                  
                  /* StencilFunction */
                  NEVER                          : 0x0200,
                  LESS                           : 0x0201,
                  EQUAL                          : 0x0202,
                  LEQUAL                         : 0x0203,
                  GREATER                        : 0x0204,
                  NOTEQUAL                       : 0x0205,
                  GEQUAL                         : 0x0206,
                  ALWAYS                         : 0x0207,
                  
                  /* StencilOp */
                  /*      ZERO */
                  KEEP                           : 0x1E00,
                  REPLACE                        : 0x1E01,
                  INCR                           : 0x1E02,
                  DECR                           : 0x1E03,
                  INVERT                         : 0x150A,
                  INCR_WRAP                      : 0x8507,
                  DECR_WRAP                      : 0x8508,
                  
                  /* StringName */
                  VENDOR                         : 0x1F00,
                  RENDERER                       : 0x1F01,
                  VERSION                        : 0x1F02,
                  
                  /* TextureMagFilter */
                  NEAREST                        : 0x2600,
                  LINEAR                         : 0x2601,
                  
                  /* TextureMinFilter */
                  /*      NEAREST */
                  /*      LINEAR */
                  NEAREST_MIPMAP_NEAREST         : 0x2700,
                  LINEAR_MIPMAP_NEAREST          : 0x2701,
                  NEAREST_MIPMAP_LINEAR          : 0x2702,
                  LINEAR_MIPMAP_LINEAR           : 0x2703,
                  
                  /* TextureParameterName */
                  TEXTURE_MAG_FILTER             : 0x2800,
                  TEXTURE_MIN_FILTER             : 0x2801,
                  TEXTURE_WRAP_S                 : 0x2802,
                  TEXTURE_WRAP_T                 : 0x2803,
                  
                  /* TextureTarget */
                  TEXTURE_2D                     : 0x0DE1,
                  TEXTURE                        : 0x1702,
                  
                  TEXTURE_CUBE_MAP               : 0x8513,
                  TEXTURE_BINDING_CUBE_MAP       : 0x8514,
                  TEXTURE_CUBE_MAP_POSITIVE_X    : 0x8515,
                  TEXTURE_CUBE_MAP_NEGATIVE_X    : 0x8516,
                  TEXTURE_CUBE_MAP_POSITIVE_Y    : 0x8517,
                  TEXTURE_CUBE_MAP_NEGATIVE_Y    : 0x8518,
                  TEXTURE_CUBE_MAP_POSITIVE_Z    : 0x8519,
                  TEXTURE_CUBE_MAP_NEGATIVE_Z    : 0x851A,
                  MAX_CUBE_MAP_TEXTURE_SIZE      : 0x851C,
                  
                  /* TextureUnit */
                  TEXTURE0                       : 0x84C0,
                  TEXTURE1                       : 0x84C1,
                  TEXTURE2                       : 0x84C2,
                  TEXTURE3                       : 0x84C3,
                  TEXTURE4                       : 0x84C4,
                  TEXTURE5                       : 0x84C5,
                  TEXTURE6                       : 0x84C6,
                  TEXTURE7                       : 0x84C7,
                  TEXTURE8                       : 0x84C8,
                  TEXTURE9                       : 0x84C9,
                  TEXTURE10                      : 0x84CA,
                  TEXTURE11                      : 0x84CB,
                  TEXTURE12                      : 0x84CC,
                  TEXTURE13                      : 0x84CD,
                  TEXTURE14                      : 0x84CE,
                  TEXTURE15                      : 0x84CF,
                  TEXTURE16                      : 0x84D0,
                  TEXTURE17                      : 0x84D1,
                  TEXTURE18                      : 0x84D2,
                  TEXTURE19                      : 0x84D3,
                  TEXTURE20                      : 0x84D4,
                  TEXTURE21                      : 0x84D5,
                  TEXTURE22                      : 0x84D6,
                  TEXTURE23                      : 0x84D7,
                  TEXTURE24                      : 0x84D8,
                  TEXTURE25                      : 0x84D9,
                  TEXTURE26                      : 0x84DA,
                  TEXTURE27                      : 0x84DB,
                  TEXTURE28                      : 0x84DC,
                  TEXTURE29                      : 0x84DD,
                  TEXTURE30                      : 0x84DE,
                  TEXTURE31                      : 0x84DF,
                  ACTIVE_TEXTURE                 : 0x84E0,
                  
                  /* TextureWrapMode */
                  REPEAT                         : 0x2901,
                  CLAMP_TO_EDGE                  : 0x812F,
                  MIRRORED_REPEAT                : 0x8370,
                  
                  /* Uniform Types */
                  FLOAT_VEC2                     : 0x8B50,
                  FLOAT_VEC3                     : 0x8B51,
                  FLOAT_VEC4                     : 0x8B52,
                  INT_VEC2                       : 0x8B53,
                  INT_VEC3                       : 0x8B54,
                  INT_VEC4                       : 0x8B55,
                  BOOL                           : 0x8B56,
                  BOOL_VEC2                      : 0x8B57,
                  BOOL_VEC3                      : 0x8B58,
                  BOOL_VEC4                      : 0x8B59,
                  FLOAT_MAT2                     : 0x8B5A,
                  FLOAT_MAT3                     : 0x8B5B,
                  FLOAT_MAT4                     : 0x8B5C,
                  SAMPLER_2D                     : 0x8B5E,
                  SAMPLER_CUBE                   : 0x8B60,
                  
                  /* Vertex Arrays */
                  VERTEX_ATTRIB_ARRAY_ENABLED        : 0x8622,
                  VERTEX_ATTRIB_ARRAY_SIZE           : 0x8623,
                  VERTEX_ATTRIB_ARRAY_STRIDE         : 0x8624,
                  VERTEX_ATTRIB_ARRAY_TYPE           : 0x8625,
                  VERTEX_ATTRIB_ARRAY_NORMALIZED     : 0x886A,
                  VERTEX_ATTRIB_ARRAY_POINTER        : 0x8645,
                  VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : 0x889F,
                  
                  /* Shader Source */
                  COMPILE_STATUS                 : 0x8B81,
                  
                  /* Shader Precision-Specified Types */
                  LOW_FLOAT                      : 0x8DF0,
                  MEDIUM_FLOAT                   : 0x8DF1,
                  HIGH_FLOAT                     : 0x8DF2,
                  LOW_INT                        : 0x8DF3,
                  MEDIUM_INT                     : 0x8DF4,
                  HIGH_INT                       : 0x8DF5,
                  
                  /* Framebuffer Object. */
                  FRAMEBUFFER                    : 0x8D40,
                  RENDERBUFFER                   : 0x8D41,
                  
                  RGBA4                          : 0x8056,
                  RGB5_A1                        : 0x8057,
                  RGB565                         : 0x8D62,
                  DEPTH_COMPONENT16              : 0x81A5,
                  STENCIL_INDEX                  : 0x1901,
                  STENCIL_INDEX8                 : 0x8D48,
                  DEPTH_STENCIL                  : 0x84F9,
                  
                  RENDERBUFFER_WIDTH             : 0x8D42,
                  RENDERBUFFER_HEIGHT            : 0x8D43,
                  RENDERBUFFER_INTERNAL_FORMAT   : 0x8D44,
                  RENDERBUFFER_RED_SIZE          : 0x8D50,
                  RENDERBUFFER_GREEN_SIZE        : 0x8D51,
                  RENDERBUFFER_BLUE_SIZE         : 0x8D52,
                  RENDERBUFFER_ALPHA_SIZE        : 0x8D53,
                  RENDERBUFFER_DEPTH_SIZE        : 0x8D54,
                  RENDERBUFFER_STENCIL_SIZE      : 0x8D55,
                  
                  FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           : 0x8CD0,
                  FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           : 0x8CD1,
                  FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         : 0x8CD2,
                  FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : 0x8CD3,
                  
                  COLOR_ATTACHMENT0              : 0x8CE0,
                  DEPTH_ATTACHMENT               : 0x8D00,
                  STENCIL_ATTACHMENT             : 0x8D20,
                  DEPTH_STENCIL_ATTACHMENT       : 0x821A,
                  
                  NONE                           : 0,
                  
                  FRAMEBUFFER_COMPLETE                      : 0x8CD5,
                  FRAMEBUFFER_INCOMPLETE_ATTACHMENT         : 0x8CD6,
                  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : 0x8CD7,
                  FRAMEBUFFER_INCOMPLETE_DIMENSIONS         : 0x8CD9,
                  FRAMEBUFFER_UNSUPPORTED                   : 0x8CDD,
                  
                  FRAMEBUFFER_BINDING            : 0x8CA6,
                  RENDERBUFFER_BINDING           : 0x8CA7,
                  MAX_RENDERBUFFER_SIZE          : 0x84E8,
                  
                  INVALID_FRAMEBUFFER_OPERATION  : 0x0506,
                  
                  /* WebGL-specific enums */
                  UNPACK_FLIP_Y_WEBGL            : 0x9240,
                  UNPACK_PREMULTIPLY_ALPHA_WEBGL : 0x9241,
                  CONTEXT_LOST_WEBGL             : 0x9242,
                  UNPACK_COLORSPACE_CONVERSION_WEBGL : 0x9243,
                  BROWSER_DEFAULT_WEBGL          : 0x9244,

                  items: {},
                  id: 0,
                  getExtension: function() { return 1 },
                  createBuffer: function() {
                    var id = this.id++;
                    this.items[id] = {
                      which: 'buffer',
                    };
                    return id;
                  },
                  deleteBuffer: function(){},
                  bindBuffer: function(){},
                  bufferData: function(){},
                  getParameter: function(pname) {
                    switch(pname) {
                      case /* GL_VENDOR                           */ 0x1F00: return 'FakeShellGLVendor';
                      case /* GL_RENDERER                         */ 0x1F01: return 'FakeShellGLRenderer';
                      case /* GL_VERSION                          */ 0x1F02: return '0.0.1';
                      case /* GL_MAX_TEXTURE_SIZE                 */ 0x0D33: return 16384;
                      case /* GL_MAX_CUBE_MAP_TEXTURE_SIZE        */ 0x851C: return 16384;
                      case /* GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT   */ 0x84FF: return 16;
                      case /* GL_MAX_TEXTURE_IMAGE_UNITS_NV       */ 0x8872: return 16;
                      case /* GL_MAX_VERTEX_UNIFORM_VECTORS       */ 0x8DFB: return 4096;
                      case /* GL_MAX_FRAGMENT_UNIFORM_VECTORS     */ 0x8DFD: return 4096;
                      case /* GL_MAX_VARYING_VECTORS              */ 0x8DFC: return 32;
                      case /* GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS */ 0x8B4D: return 32;
                      default: throw 'getParameter ' + pname;
                    }
                  },
                  getSupportedExtensions: function() {
                    return ["OES_texture_float", "OES_standard_derivatives", "EXT_texture_filter_anisotropic", "MOZ_EXT_texture_filter_anisotropic", "MOZ_WEBGL_lose_context", "MOZ_WEBGL_compressed_texture_s3tc", "MOZ_WEBGL_depth_texture"];
                  },
                  createShader: function(type) {
                    var id = this.id++;
                    this.items[id] = {
                      which: 'shader',
                      type: type,
                    };
                    return id;
                  },
                  getShaderParameter: function(shader, pname) {
                    switch(pname) {
                      case /* GL_SHADER_TYPE    */ 0x8B4F: return this.items[shader].type;
                      case /* GL_COMPILE_STATUS */ 0x8B81: return true;
                      default: throw 'getShaderParameter ' + pname;
                    }
                  },
                  shaderSource: function(){},
                  compileShader: function(){},
                  createProgram: function() {
                    var id = this.id++;
                    this.items[id] = {
                      which: 'program',
                      shaders: [],
                    };
                    return id;
                  },
                  attachShader: function(program, shader) {
                    this.items[program].shaders.push(shader);
                  },
                  bindAttribLocation: function(){},
                  linkProgram: function(){},
                  getProgramParameter: function(program, pname) {
                    switch(pname) {
                      case /* LINK_STATUS     */ 0x8B82: return true;
                      case /* ACTIVE_UNIFORMS */ 0x8B86: return 4;
                      default: throw 'getProgramParameter ' + pname;
                    }
                  },
                  deleteShader: function(){},
                  deleteProgram: function(){},
                  viewport: function(){},
                  clearColor: function(){},
                  clearDepth: function(){},
                  depthFunc: function(){},
                  enable: function(){},
                  disable: function(){},
                  frontFace: function(){},
                  cullFace: function(){},
                  activeTexture: function(){},
                  createTexture: function() {
                    var id = this.id++;
                    this.items[id] = {
                      which: 'texture',
                    };
                    return id;
                  },
                  deleteTexture: function(){},
                  boundTextures: {},
                  bindTexture: function(target, texture) {
                    this.boundTextures[target] = texture;
                  },
                  texParameteri: function(){},
                  pixelStorei: function(){},
                  texImage2D: function(){},
                  compressedTexImage2D: function(){},
                  useProgram: function(){},
                  getUniformLocation: function() {
                    return null;
                  },
                  getActiveUniform: function(program, index) {
                    return {
                      size: 1,
                      type: /* INT_VEC3 */ 0x8B54,
                      name: 'activeUniform' + index,
                    };
                  },
                  clear: function(){},
                  uniform4fv: function(){},
                  uniform1i: function(){},
                  getAttribLocation: function() { return 1 },
                  vertexAttribPointer: function(){},
                  enableVertexAttribArray: function(){},
                  disableVertexAttribArray: function(){},
                  drawElements: function(){},
                  drawArrays: function(){},
                  depthMask: function(){},
                  depthRange: function(){},
                  bufferSubData: function(){},
                  blendFunc: function(){},
                  createFramebuffer: function() {
                    var id = this.id++;
                    this.items[id] = {
                      which: 'framebuffer',
                      shaders: [],
                    };
                    return id;
                  },
                  bindFramebuffer: function(){},
                  framebufferTexture2D: function(){},
                  checkFramebufferStatus: function() {
                    return /* FRAMEBUFFER_COMPLETE */ 0x8CD5;
                  },
                  createRenderbuffer: function() {
                    var id = this.id++;
                    this.items[id] = {
                      which: 'renderbuffer',
                      shaders: [],
                    };
                    return id;
                  },
                  bindRenderbuffer: function(){},
                  renderbufferStorage: function(){},
                  framebufferRenderbuffer: function(){},
                  scissor: function(){},
                  colorMask: function(){},
                  lineWidth: function(){},
                };
              }
              case '2d': {
                return {
                  drawImage: function(){},
                  getImageData: function(x, y, w, h) {
                    return {
                      width: w,
                      height: h,
                      data: new Uint8ClampedArray(w*h),
                    };
                  },
                };
              }
              default: throw 'canvas.getContext: ' + which;
            }
          },
          requestPointerLock: function() {
            document.pointerLockElement = document.getElementById('canvas');
            window.setTimeout(function() {
              document.callEventListeners('pointerlockchange');
            });
          },
          style: {},
          eventListeners: {},
          addEventListener: document.addEventListener,
          callEventListeners: document.callEventListeners,
          requestFullScreen: function() {
            document.fullscreenElement = document.getElementById('canvas');
            window.setTimeout(function() {
              document.callEventListeners('fullscreenchange');
            });
          },
          offsetTop: 0,
          offsetLeft: 0,
        };
      }
      case 'status-text': case 'progress': {
        return {};
      }
      default: throw 'getElementById: ' + id;
    }
  },
  createElement: function(what) {
    switch (what) {
      case 'canvas': return document.getElementById(what);
      case 'script': {
        var ret = {};
        window.setTimeout(function() {
          print('loading script: ' + ret.src);
          load(ret.src);
          print('   script loaded.');
          if (ret.onload) {
            window.setTimeout(function() {
              ret.onload(); // yeah yeah this might vanish
            });
          }
        });
        return ret;
      }
      default: throw 'createElement ' + what;
    }
  },
  elements: {},
  querySelector: function(id) {
    if (!document.elements[id]) {
      document.elements[id] = {
        classList: {
          add: function(){},
          remove: function(){},
        },
        eventListeners: {},
        addEventListener: document.addEventListener,
        callEventListeners: document.callEventListeners,
      };
    };
    return document.elements[id];
  },
  styleSheets: [{
    cssRules: [],
    insertRule: function(){},
  }],
  body: {
    appendChild: function(){},
  },
};
var alert = function(x) {
  print(x);
};
var originalDateNow = Date.now;
var performance = {
  now: function() {
    return originalDateNow.call(Date);
  },
};
function fixPath(path) {
  if (path[0] == '/') path = path.substring(1);
  var dirsToDrop = 1; // go back to root dir if first_js is in a subdir
  for (var i = 0; i < dirsToDrop; i++) {
    path = '../' + path;
  }
  return path
}
var XMLHttpRequest = function() {
  return {
    open: function(mode, path, async) {
      path = fixPath(path);
      this.mode = mode;
      this.path = path;
      this.async = async;
    },
    send: function() {
      if (!this.async) {
        this.doSend();
      } else {
        var that = this;
        window.setTimeout(function() {
          that.doSend();
          if (that.onload) that.onload();
        }, 0);
      }
    },
    doSend: function() {
      if (this.responseType == 'arraybuffer') {
        this.response = read(this.path, 'binary');
      } else {
        this.responseText = read(this.path);
      }
    },
  };
};
var Audio = function() {
  return {
    play: function(){},
    pause: function(){},
    cloneNode: function() {
      return this;
    },
  };
};
var Image = function() {
  var that = this;
  window.setTimeout(function() {
    that.complete = true;
    that.width = 64;
    that.height = 64;
    if (that.onload) that.onload();
  });
};
var Worker = function(workerPath) {
  workerPath = fixPath(workerPath);
  var workerCode = read(workerPath);
  workerCode = workerCode.replace(/Module/g, 'zzModuleyy' + (Worker.id++)). // prevent collision with the global Module object. Note that this becomes global, so we need unique ids
                          replace(/Date.now/g, 'Recorder.dnow'). // recorded values are just for the "main thread" - workers were not recorded, and should not consume
                          replace(/performance.now/g, 'Recorder.pnow').
                          replace(/Math.random/g, 'Recorder.random').
                          replace(/\nonmessage = /, '\nvar onmessage = '); // workers commonly do "onmessage = ", we need to varify that to sandbox
  print('loading worker ' + workerPath + ' : ' + workerCode.substring(0, 50));
  eval(workerCode); // will implement onmessage()

  function duplicateJSON(json) {
    function handleTypedArrays(key, value) {
      if (value && value.toString && value.toString().substring(0, 8) == '[object ' && value.length && value.byteLength) {
        return Array.prototype.slice.call(value);
      }
      return value;
    }
    return JSON.parse(JSON.stringify(json, handleTypedArrays))
  }
  this.terminate = function(){};
  this.postMessage = function(msg) {
    msg.messageId = Worker.messageId++;
    print('main thread sending message ' + msg.messageId + ' to worker ' + workerPath);
    window.setTimeout(function() {
      print('worker ' + workerPath + ' receiving message ' + msg.messageId);
      onmessage({ data: duplicateJSON(msg) });
    });
  };
  var thisWorker = this;
  var postMessage = function(msg) {
    msg.messageId = Worker.messageId++;
    print('worker ' + workerPath + ' sending message ' + msg.messageId);
    window.setTimeout(function() {
      print('main thread receiving message ' + msg.messageId + ' from ' + workerPath);
      thisWorker.onmessage({ data: duplicateJSON(msg) });
    });
  };
};
Worker.id = 0;
Worker.messageId = 0;
var screen = {
  width: 2100,
  height: 1313,
  availWidth: 2100,
  availHeight: 1283,
};
var console = {
  log: function(x) {
    print(x);
  },
};
var MozBlobBuilder = function() {
  this.data = new Uint8Array(0);
  this.append = function(buffer) {
    var data = new Uint8Array(buffer);
    var combined = new Uint8Array(this.data.length + data.length);
    combined.set(this.data);
    combined.set(data, this.data.length);
    this.data = combined;
  };
  this.getBlob = function() {
    return this.data.buffer; // return the buffer as a "blob". XXX We might need to change this if it is not opaque
  };
};


var Recorder = (function() {
  var recorder;
  var init = 'reproduce=';
  var initLocation = window.location.search.indexOf(init);
  var replaying = initLocation >= 0;
  var raf = window['requestAnimationFrame'] ||
            window['mozRequestAnimationFrame'] ||
            window['webkitRequestAnimationFrame'] ||
            window['msRequestAnimationFrame'] ||
            window['oRequestAnimationFrame'];
  if (!replaying) {
    // Prepare to record
    recorder = {};
    // Start
    recorder.frameCounter = 0; // the frame counter is used to know when to replay events
    recorder.start = function() {
      alert("Starting recording! Don't forget to Recorder.finish() afterwards!");
      function count() {
        recorder.frameCounter++;
        raf(count);
      }
      count();
      recorder.started = true;
    };
    // Math.random
    recorder.randoms = [];
    recorder.random = Math.random;
    Math.random = function() {
      var ret = recorder.random();
      recorder.randoms.push(ret);
      return ret;
    };
    // Date.now, performance.now
    recorder.dnows = [];
    recorder.dnow = Date.now;
    Date.now = function() {
      var ret = recorder.dnow();
      recorder.dnows.push(ret);
      return ret;
    };
    recorder.pnows = [];
    recorder.pnow = performance.now;
    performance.now = function() {
      var ret = recorder.pnow();
      recorder.pnows.push(ret);
      return ret;
    };
    // Events
    recorder.devents = []; // document events
    recorder.onEvent = function(which, callback) {
      document['on' + which] = function(event) {
        if (!recorder.started) return true;
        event.frameCounter = recorder.frameCounter;
        recorder.devents.push(event);
        return callback(event); // XXX do we need to record the return value?
      };
    };
    recorder.tevents = []; // custom-target events. Currently we assume a single such custom target (aside from document), e.g., a canvas for the game.
    recorder.addListener = function(target, which, callback, arg) {
      target.addEventListener(which, function(event) {
        if (!recorder.started) return true;
        event.frameCounter = recorder.frameCounter;
        recorder.tevents.push(event);
        return callback(event); // XXX do we need to record the return value?
      }, arg);
    };
    // Finish
    recorder.finish = function() {
      // Reorder data because pop() is faster than shift()
      recorder.randoms.reverse();
      recorder.dnows.reverse();
      recorder.pnows.reverse();
      recorder.devents.reverse();
      recorder.tevents.reverse();
      // Make JSON.stringify work on data from native event objects (and only store relevant ones)
      var importantProperties = {
        type: 1,
        movementX: 1, mozMovementX: 1, webkitMovementX: 1,
        movementY: 1, mozMovementY: 1, webkitMovementY: 1,
        detail: 1,
        wheelDelta: 1,
        pageX: 1,
        pageY: 1,
        button: 1,
        keyCode: 1,
        frameCounter: 1
      };
      function importantize(event) {
        var ret = {};
        for (var prop in importantProperties) {
          if (prop in event) {
            ret[prop] = event[prop];
          }
        }
        return ret;
      }
      recorder.devents = recorder.devents.map(importantize);
      recorder.tevents = recorder.tevents.map(importantize);
      // Write out
      alert('Writing out data, remember to save!');
      setTimeout(function() {
        document.open();
        document.write(JSON.stringify(recorder));
        document.close();
      }, 0);
      return '.';
    };
  } else {
    // Load recording
    var dataPath = window.location.search.substring(initLocation + init.length);
    var baseURL = window.location.toString().replace('://', 'cheez999').split('?')[0].split('/').slice(0, -1).join('/').replace('cheez999', '://');
    if (baseURL[baseURL.length-1] != '/') baseURL += '/';
    var path = baseURL + dataPath;
    alert('Loading replay from ' + path);
    var request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send();
    var raw = request.responseText;
    raw = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}')+1); // remove <html> etc
    recorder = JSON.parse(raw);
    // prepare to replay
    // Start
    recorder.frameCounter = 0; // the frame counter is used to know when to replay events
    recorder.start = function() {
      function count() {
        recorder.frameCounter++;
        raf(count);
        // replay relevant events for this frame
        while (recorder.devents.length && recorder.devents[recorder.devents.length-1].frameCounter <= recorder.frameCounter) {
          var event = recorder.devents.pop();
          recorder['on' + event.type](event);
        }
        while (recorder.tevents.length && recorder.tevents[recorder.tevents.length-1].frameCounter <= recorder.frameCounter) {
          var event = recorder.tevents.pop();
          recorder['event' + event.type](event);
        }
      }
      count();
    };
    // Math.random
    recorder.random = Math.random;
    Math.random = function() {
      if (recorder.randoms.length > 0) {
        return recorder.randoms.pop();
      } else {
        recorder.finish();
        throw 'consuming too many random values!';
      }
    };
    // Date.now, performance.now
    recorder.dnow = Date.now;
    Date.now = function() {
      if (recorder.dnows.length > 0) {
        return recorder.dnows.pop();
      } else {
        recorder.finish();
        throw 'consuming too many Date.now values!';
      }
    };
    var pnow = performance.now || performance.webkitNow || performance.mozNow || performance.oNow || performance.msNow;
    recorder.pnow = function() { return pnow.call(performance) };
    performance.now = function() {
      if (recorder.pnows.length > 0) {
        return recorder.pnows.pop();
      } else {
        recorder.finish();
        throw 'consuming too many performance.now values!';
      }
    };
    // Events
    recorder.onEvent = function(which, callback) {
      recorder['on' + which] = callback;
    };
    recorder.eventCallbacks = {};
    recorder.addListener = function(target, which, callback, arg) {
      recorder['event' + which] = callback;
    };
    recorder.onFinish = [];
    // Benchmarking hooks - emscripten specific
    setTimeout(function() {
      var totalTime = 0;
      var totalSquared = 0;
      var iterations = 0;
      var maxTime = 0;
      var curr = 0;
      Module.preMainLoop = function() {
        curr = recorder.pnow();
      }
      Module.postMainLoop = function() {
        var time = recorder.pnow() - curr;
        totalTime += time;
        totalSquared += time*time;
        maxTime = Math.max(maxTime, time);
        iterations++;
      };
      recorder.onFinish.push(function() {
        var mean = totalTime / iterations;
        var meanSquared = totalSquared / iterations;
        console.log('mean frame   : ' + mean + ' ms');
        console.log('frame std dev: ' + Math.sqrt(meanSquared - (mean*mean)) + ' ms');
        console.log('max frame    : ' + maxTime + ' ms');
      });    
    });
    // Finish
    recorder.finish = function() {
      recorder.onFinish.forEach(function(finish) {
        finish();
      });
    };
  }
  recorder.replaying = replaying;
  return recorder;
})();


// Setup compiled code parameters and interaction with the web page
var Module = {
  failed: false,
  preRun: [],
  postRun: [],
  preloadPlugins: [],
  print: function(text) {
    console.log('[STDOUT] ' + text);
  },
  printErr: function(text) {
    console.log(text);
  },
  canvas: document.getElementById('canvas'),
  statusMessage: 'Starting...',
  setStatus: function(text) {
    if (Module.setStatus.interval) clearInterval(Module.setStatus.interval);
    var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    var statusElement = document.getElementById('status-text');
    var progressElement = document.getElementById('progress');
    if (m) {
      text = m[1];
      progressElement.value = parseInt(m[2])*100;
      progressElement.max = parseInt(m[4])*100;
      progressElement.hidden = false;
    } else {
      progressElement.value = null;
      progressElement.max = null;
      progressElement.hidden = true;
    }
    statusElement.innerHTML = text;
  },
  totalDependencies: 0,
  monitorRunDependencies: function(left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
  },
  onFullScreen: function(isFullScreen) {
    if (isFullScreen) {
      Module.resumeMainLoop();
      Module.setOpacity(1);
      Module.setStatus('');
      document.querySelector('.status .ingame').classList.add( 'hide' );
      document.querySelector('canvas').classList.remove( 'paused' );
      //BananaBread.execute('musicvol $oldmusicvol'); // XXX TODO: need to restart the music by name here
    } else {
      Module.pauseMainLoop();
      Module.setOpacity(0.333);
      Module.setStatus('<b>paused (enter fullscreen to resume)</b>');
      document.querySelector('canvas').classList.add( 'paused' );
      document.querySelector('.status .ingame').classList.remove( 'hide' );
      //BananaBread.execute('oldmusicvol = $musicvol ; musicvol 0');
    }
  }
};

// Checks for features we cannot run without
// Note: Modify this for your needs. If your level does not use
//       texture compression, remove the check for it here.

(function() {
  function fail(text) {
    Module._main = null;
    document.querySelector('.status-content.error .details').innerHTML = text + ' is missing.';
    document.querySelector('.status-content.loading .progress-container').classList.add('hide');
    document.querySelector('.status-content.error').classList.remove('hide');
    Module.failed = true;
    throw text;
  }
  try {
    var canvas = document.createElement('canvas');
  } catch(e){}
  if (!canvas) fail('canvas element');
  try {
    var context = canvas.getContext('experimental-webgl');
  } catch(e){}
  if (!context) fail('WebGL');
  var s3tc = context.getExtension('WEBGL_compressed_texture_s3tc') ||
             context.getExtension('MOZ_WEBGL_compressed_texture_s3tc') ||
             context.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
  if (!s3tc) fail('texture compression');
  var pointerLock = canvas['requestPointerLock'] ||
                    canvas['mozRequestPointerLock'] ||
                    canvas['webkitRequestPointerLock'];
  if (!pointerLock) fail('pointer lock/mouse lock');
})();

// Loading music. Will be stopped once the first frame of the game runs

Module.loadingMusic = new Audio();
Module.loadingMusic.src = 'assets/OutThere_0.ogg';
Module.loadingMusic.play();

Module.readySound = new Audio();
Module.readySound.src = 'assets/alarmcreatemiltaryfoot_1.ogg';

// Pre-unzip ogz files, we can do this in parallel in a worker during preload

(function() {
  var zeeWorker = new Worker('game/zee-worker.js');

  var zeeCallbacks = [];

  zeeWorker.onmessage = function(msg) {
    zeeCallbacks[msg.data.callbackID](msg.data.data);
    console.log("zee'd " + msg.data.filename + ' in ' + msg.data.time + ' ms, ' + msg.data.data.length + ' bytes');
    zeeCallbacks[msg.data.callbackID] = null;
  };

  function requestZee(filename, data, callback) {
    zeeWorker.postMessage({
      filename: filename,
      data: data,
      callbackID: zeeCallbacks.length
    });
    zeeCallbacks.push(callback);
  }

  Module.postRun.push(function() {
    zeeWorker.terminate();
  });

  Module.preloadPlugins.push({
    canHandle: function(name) {
      return name.substr(-4) == '.ogz';
    },
    handle: function(byteArray, name, onload, onerror) {
      requestZee(name, byteArray, function(byteArray) {
        onload(byteArray);
      });
    }
  });
})();

// Hooks

Module.setOpacity = function(opacity) {
  var rule = 'canvas.emscripten';
  var more = 'border: 1px solid black';
  var styleSheet = document.styleSheets[0];
  var rules = styleSheet.cssRules;
  for (var i = 0; i < rules.length; i++) {
    if (rules[i].cssText.substr(0, rule.length) == rule) {
      styleSheet.deleteRule(i);
      i--;
    }
  }
  styleSheet.insertRule(rule + ' { opacity: ' + opacity + '; ' + (more || '') + ' }', 0);
}

Module.setOpacity(0.1);

Module.fullscreenCallbacks = [];

Module.postLoadWorld = function() {
  document.title = 'BananaBread';

  if (Module.loadingMusic) {
    Module.loadingMusic.pause();
    Module.loadingMusic = null;
  }
  Module.tweakDetail();

  BananaBread.execute('sensitivity 10');
  BananaBread.execute('clearconsole');

  setTimeout(function() {
    BananaBread.execute('oldmusicvol = $musicvol ; musicvol 0');
  }, 1); // Do after startup finishes so music will be prepared up

  // Pause and fade out until the user presses fullscreen

  Module.pauseMainLoop();
  setTimeout(function() {
    document.querySelector('.status-content.loading').classList.add('hide');
    document.querySelector('.status-content.fullscreen-buttons').classList.remove('hide');
  }, 0);

  Module.resume = function() {
    Module.requestFullScreen();
    Module.setOpacity(1);
    Module.setStatus('');
    Module.resumeMainLoop();
 };

  Module.fullscreenLow = function() {
    document.querySelector('.status-content.fullscreen-buttons').classList.add('hide');
    document.querySelector('canvas').classList.remove('hide');
    Module.requestFullScreen();
    Module.setOpacity(1);
    Module.setStatus('');
    Module.resumeMainLoop();
    Module.fullscreenCallbacks.forEach(function(callback) { callback() });
  };

  Module.fullscreenHigh = function() {
    document.querySelector('.status-content.fullscreen-buttons').classList.add('hide');
    document.querySelector('canvas').classList.remove('hide');
    Module.requestFullScreen();
    Module.setOpacity(1);
    Module.setStatus('');
    BananaBread.execute('screenres ' + screen.width + ' ' + screen.height);
    Module.resumeMainLoop();
    Module.fullscreenCallbacks.forEach(function(callback) { callback() });
  };

  // All set!
  Module.readySound.play();
  Module.readySound = null;

  if (replayingRecording) {
    Module.startupFinish = Recorder.pnow();
  }
};

Module.autoexec = function(){}; // called during autoexec on load, so useful to tweak settings that require gl restart
Module.tweakDetail = function(){}; // called from postLoadWorld, so useful to make changes after the map has been loaded

(function() {
  var fraction = 0.70;
  var desired = Math.min(fraction*screen.availWidth, fraction*screen.availHeight, 600);
  var w, h;
  if (screen.width >= screen.height) {
    h = desired;
    w = Math.floor(desired * screen.width / screen.height);
  } else {
    w = desired;
    h = Math.floor(desired * screen.height / screen.width);
  }
  Module.desiredWidth = w;
  Module.desiredHeight = h;
})();

// Public API

var BananaBread = {
  init: function() {
    BananaBread.setPlayerModelInfo = Module.cwrap('_ZN4game18setplayermodelinfoEPKcS1_S1_S1_S1_S1_S1_S1_S1_S1_S1_S1_b', null,
      ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'number']);
    BananaBread.execute = Module.cwrap('_Z7executePKc', 'number', ['string']);
    BananaBread.executeString = Module.cwrap('_Z10executestrPKc', 'string', ['string']);

    var forceCamera = Module.cwrap('setforcecamera', null, ['number', 'number', 'number', 'number', 'number', 'number']);
    BananaBread.forceCamera = function(position, orientation) {
      forceCamera(position[0], position[1], position[2], orientation[0], orientation[1], orientation[2]);
    };

    BananaBread.PARTICLE = {};
    var i = 0;
    BananaBread.PARTICLE.BLOOD = (i++);
    BananaBread.PARTICLE.WATER = (i++);
    BananaBread.PARTICLE.SMOKE = (i++);
    BananaBread.PARTICLE.STEAM = (i++);
    BananaBread.PARTICLE.FLAME = (i++);
    BananaBread.PARTICLE.FIREBALL1 = (i++);
    BananaBread.PARTICLE.FIREBALL2 = (i++);
    BananaBread.PARTICLE.FIREBALL3 = (i++);
    BananaBread.PARTICLE.STREAK = (i++);
    BananaBread.PARTICLE.LIGHTNING = (i++);
    BananaBread.PARTICLE.EXPLOSION = (i++);
    BananaBread.PARTICLE.EXPLOSION_BLUE = (i++);
    BananaBread.PARTICLE.SPARK = (i++);
    BananaBread.PARTICLE.EDIT = (i++);
    BananaBread.PARTICLE.SNOW = (i++);
    BananaBread.PARTICLE.MUZZLE_FLASH1 = (i++);
    BananaBread.PARTICLE.MUZZLE_FLASH2 = (i++);
    BananaBread.PARTICLE.MUZZLE_FLASH3 = (i++);
    BananaBread.PARTICLE.HUD_ICON = (i++);
    BananaBread.PARTICLE.HUD_ICON_GREY = (i++);
    BananaBread.PARTICLE.TEXT = (i++);
    BananaBread.PARTICLE.METER = (i++);
    BananaBread.PARTICLE.METER_VS = (i++);
    BananaBread.PARTICLE.LENS_FLARE = (i++);
    var splash = Module.cwrap('bb_splash', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    BananaBread.splash = function(type, color, radius, num, fade, p, size, gravity) {
      splash(type, color, radius, num, fade, p[0], p[1], p[2], size, gravity);
    };

    var playSoundName = Module.cwrap('bb_playsoundname', null, ['string', 'number', 'number', 'number']);
    BananaBread.playSound = function(name, position) {
      playSoundName(name, position[0], position[1], position[2]);
    };
  },
};

Module.postRun.push(BananaBread.init);
Module.postRun.push(function() {
  var n = 0;
  for (var x in Module.preloadedAudios) n++;
  console.log('successfully preloaded audios: ' + n);
  if (n == 0) alert('Your browser could not load the audio files. Running will continue without sound effects.');
});

// Additional APIs

BananaBread.Utils = {
  randomPick: function(items) {
    return items[Math.floor(Math.random()*items.length)];
  },
};

BananaBread.Event = function(data) {
  this.run = function() {
    var start = Date.now();
    var last = start;
    function iteration() {
      var now = Date.now();
      var ms = now - last;
      last = now;
      if (ms > data.totalMs) return;
      data.onFrame(ms);
      Module.requestAnimationFrame(iteration);
    }
    iteration();
  };
  if (data.onInit) data.onInit(data);
}

BananaBread.Effects = {
  Fireworks: function(shots) {
    var event = new BananaBread.Event({
      totalMs: Infinity,

      onFrame: function(ms) {

        var secs = ms/1000;
        var newShots = [];

        shots = shots.filter(function(shot) {
          LinearMath.vec3.add(shot.position, LinearMath.vec3.scale(LinearMath.vec3.create(shot.velocity), secs));
          shot.velocity[2] -= secs * 200; // gravity
          shot.msLeft -= ms;
          if (shot.msLeft > 0) {
            BananaBread.splash(BananaBread.PARTICLE.SPARK, 0xffffff, 1, 20, Math.max(50, ms*2), shot.position, 1, 1);
            return true;
          } else {
            var size = Math.ceil(Math.random()*3); // 1, 2 or 3
            var color;
            for (var i = 0; i < 2; i++) {
              color = Math.floor(Math.random()*255) + (Math.floor(Math.random()*255) << 8) + (Math.floor(Math.random()*255) << 16);
              BananaBread.splash(BananaBread.PARTICLE.SPARK, color, 100+25*size, 7+3*size, Math.max(300, ms*7), shot.position, 1+size, 1);
            }
            if (size > 1) {
              BananaBread.splash(BananaBread.PARTICLE.EXPLOSION, color, 0, 1, Math.max(175, ms*3), shot.position, 5*size, 0);
            }
            BananaBread.playSound(size == 3 ? 'q009/explosion.ogg' : 'olpc/MichaelBierylo/sfx_DoorSlam.wav', shot.position);
            return false;
          }
        });
      
        shots.push.apply(shots, newShots);

        if (shots.length == 0) this.totalMs = 0;
      },
    });

    event.run();
  }
};

function CameraPath(data) { // TODO: namespace this
  var steps = data.steps;
  var n = data.steps.length;
  var timeScale = data.timeScale;
  var position = LinearMath.vec3.create();
  var temp = LinearMath.vec3.create();
  var orientation = LinearMath.vec3.create();
  var cancelled = false;
  var sigma = data.sigma || 0.75;
  var lasti = -1;
  var debug = data.debug;
  var loop = data.loop;

  if (!data.uncancellable) addEventListener('keydown', function() { cancelled = true });

  this.execute = function() {
    var startTime = null;
    function moveCamera() {
      if (!startTime) startTime = Date.now();
      if (cancelled) return;
      var now = Date.now();
      var t = (Date.now() - startTime)/(timeScale*1000);
      if (t > n-1 && !loop) return;
      var i = Math.round(t);
      if (debug && i != lasti) {
        lasti = i;
        alert('now on ' + i);
        startTime += (Date.now() - now); // ignore alert wait time
      }
      var factors = 0;
      position[0] = position[1] = position[2] = orientation[0] = orientation[1] = orientation[2] = 0;
      for (var j = i-2; j <= i+2; j++) {
        var jj = j;
        if (loop && jj >= n) jj = jj % n;
        var curr = steps[jj];
        if (!curr) continue;
        var factor = Math.exp(-Math.pow((j-t)/sigma, 2));
        LinearMath.vec3.scale(curr.position, factor, temp);
        LinearMath.vec3.add(position, temp);
        LinearMath.vec3.scale(curr.orientation, factor, temp);
        LinearMath.vec3.add(orientation, temp);
        factors += factor;
      }
      LinearMath.vec3.scale(position, 1/factors);
      LinearMath.vec3.scale(orientation, 1/factors);
      BananaBread.forceCamera(position, orientation);
      Module.requestAnimationFrame(moveCamera);
    }
    Module.fullscreenCallbacks.push(moveCamera);
  }
}

// Benchmarking glue

var replayingRecording = false;

if (typeof Recorder != 'undefined') {
  Module.fullscreenCallbacks.push(function() {
    Recorder.start();
  });

  replayingRecording = Recorder.replaying;

  if (replayingRecording) {
    Recorder.onFinish.push(function() {
      console.log('startup   : ' + (Module.startupFinish - Module.startupStart) + ' ms');
    });

    Module.startupStart = Recorder.pnow();
  }
}

// Load scripts

(function() {
  function loadChildScript(name, then) {
    var js = document.createElement('script');
    if (then) js.onload = then;
    js.src = name;
    document.body.appendChild(js);
  }

  var queryString = window.location.search ? window.location.search.substring(1) : "";
  var urlParts, debug;

  try {
    urlParts = queryString.split(',');
    debug = queryString.indexOf('debug') >= 0;
  }
  catch(e){
    // default to sanity if url parsing fails
    urlParts = ['low','low'];
    debug = false;
  }

  var setup = urlParts[0], preload = urlParts[1];

  var levelTitleContainer = document.querySelector('.level-title span');
  var levelTitle = setup === 'high' ? 'Lava Chamber' : setup === 'medium' ? 'Two Towers' : 'Arena'; 
  levelTitleContainer.innerHTML = levelTitle;

  var previewContainer = document.querySelector('.preview-content.' + setup );
  previewContainer.classList.add('show');

  if(!Module.failed){
    loadChildScript('game/gl-matrix.js', function() {
      loadChildScript('game/setup_' + setup + '.js', function() {
        loadChildScript('game/preload_' + preload + '.js', function() {
          loadChildScript('game/bb' + (debug ? '.debug' : '') + '.js');
        });
      });
    });
  }
})();

(function(){
  var lowResButton = document.querySelector('.fullscreen-button.low-res');
  var highResButton = document.querySelector('.fullscreen-button.high-res');
  var resumeButton = document.querySelector('.fullscreen-button.resume');
  var quitButton = document.querySelector('.fullscreen-button.quit');
  lowResButton.addEventListener('click', function(e){
    Module.fullscreenLow();
  }, false);
  highResButton.addEventListener('click', function(e){
    Module.fullscreenHigh();
  }, false);
  resumeButton.addEventListener('click', function(e){
    Module.resume();
  }, false);
  quitButton.addEventListener('click', function(e){
    window.location = 'index.html';
  }, false);
})();


window.runEventLoop();
