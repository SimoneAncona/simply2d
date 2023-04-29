{
    'targets': [
        {
            'target_name': 'canvas_sdl2',
            'sources': [
                'src\\init.cpp',
                'src\\sdl2node.cpp',
                'src\\sdl2image_node.cpp'
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
            },
            'conditions': [
                ["OS==\"win\"", {
                    'include_dirs': [
                        "C:\\SDL\\SDL2-2.26.5\\include",
                        "C:\\SDL_Image\\SDL2_image-2.6.3\\include",
                        "<!@(node -p \"require('node-addon-api').include\")",
                        "<(module_root_dir)\\src\\*.hh>"
                    ],
                    'dependencies': [
                        "<!(node -p \"require('node-addon-api').gyp\")"
                    ],
                    'libraries': [
                        "C:\\SDL\\SDL2-2.26.5\\lib\\x64\\SDL2.lib",
                        "C:\\SDL_Image\\SDL2_image-2.6.3\\lib\\x64\\SDL2_image.lib"
                    ],
                    'copies': [
                        {
                            'destination': '<(module_root_dir)/build/Release/',
                            'files': [
                                'C:\\SDL\\SDL2-2.26.5\\lib\\x64\\SDL2.dll',
                                'C:\\SDL_Image\\SDL2_image-2.6.3\\lib\\x64\\SDL2_image.dll'
                            ]
                        },
                        {
                            'destination': '<(module_root_dir)/build/Debug/',
                            'files': [
                                'C:\\SDL\\SDL2-2.26.5\\lib\\x64\\SDL2.dll',
                                'C:\\SDL_Image\\SDL2_image-2.6.3\\lib\\x64\\SDL2_image.dll'
                            ]
                        }
                    ]
                }]
            ]
        }
    ]
}
