{
    'targets': [
        {
            'target_name': 'canvas_sdl2',
            'sources': ['src/sdl2node.cpp'],
            'include_dirs': [
                "C:\\SDL\\SDL2-2.26.5\\x86_64-w64-mingw32\\include",
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            'dependencies': [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            'libraries': [
                "C:\\Users\\simon\\Downloads\\SDL2-devel-2.26.5-VC\\SDL2-2.26.5\\lib\\x64\\SDL2.lib"
            ],
            'cflags!': ['-fno-exceptions'],
            'cflags_cc!': ['-fno-exceptions'],
            'xcode_settings': {
                'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                'CLANG_CXX_LIBRARY': 'libc++',
                'MACOSX_DEPLOYMENT_TARGET': '10.7'
            },
            'msvs_settings': {
                'VCCLCompilerTool': {'ExceptionHandling': 1},
            }
        }
    ]
}
