{
    'targets': [
        {
            'target_name': 'canvas_sdl2',
            'sources': [
                'src\\init.cpp',
                'src\\sdl2node.cpp',
                'src\\sdl2image_node.cpp',
                'src\\common.cpp'
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
            'dependencies': [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            'include_dirs': [
                        "<(module_root_dir)\\include\\sdl\\",
                        "<(module_root_dir)\\include\\sdlimg\\",
                        "<!@(node -p \"require('node-addon-api').include\")",
                    ],
            'conditions': [
                ["OS==\"win\"", {
                    'libraries': [
                        "<(module_root_dir)\\bin\\sdl\\winx64\\SDL2.lib",
                        "<(module_root_dir)\\bin\\sdlimg\\winx64\\SDL2_image.lib",
                    ],
                    'copies': [
                        {
                            'destination': '<(module_root_dir)/build/Release/',
                            'files': [
                                '<(module_root_dir)\\bin\\sdl\\winx64\\SDL2.dll',
                                '<(module_root_dir)\\bin\\sdlimg\\winx64\\SDL2_image.dll'
                            ]
                        },
                        {
                            'destination': '<(module_root_dir)/build/Debug/',
                            'files': [
                                '<(module_root_dir)\\bin\\sdl\\winx64\\SDL2.dll',
                                '<(module_root_dir)\\bin\\sdlimg\\winx64\\SDL2_image.dll'
                            ]
                        }
                    ]
                }]
            ]
        }
    ]
}
