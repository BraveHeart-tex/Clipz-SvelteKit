import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

const midnightVibes: CustomThemeConfig = {
  name: 'midnight-vibes',
  properties: {
    // =~= Theme Properties =~=
    '--theme-font-family-base': `system-ui`,
    '--theme-font-family-heading': `system-ui`,
    '--theme-font-color-base': '0 0 0',
    '--theme-font-color-dark': '255 255 255',
    '--theme-rounded-base': '9999px',
    '--theme-rounded-container': '12px',
    '--theme-border-base': '1px',
    // =~= Theme On-X Colors =~=
    '--on-primary': '255 255 255',
    '--on-secondary': '0 0 0',
    '--on-tertiary': '0 0 0',
    '--on-success': '0 0 0',
    '--on-warning': '0 0 0',
    '--on-error': '0 0 0',
    '--on-surface': '255 255 255',
    // =~= Theme Colors  =~=
    // primary | #2E2E2E
    '--color-primary-50': '224 224 224', // #e0e0e0
    '--color-primary-100': '213 213 213', // #d5d5d5
    '--color-primary-200': '203 203 203', // #cbcbcb
    '--color-primary-300': '171 171 171', // #ababab
    '--color-primary-400': '109 109 109', // #6d6d6d
    '--color-primary-500': '46 46 46', // #2E2E2E
    '--color-primary-600': '41 41 41', // #292929
    '--color-primary-700': '35 35 35', // #232323
    '--color-primary-800': '28 28 28', // #1c1c1c
    '--color-primary-900': '23 23 23', // #171717
    // secondary | #0099ff
    '--color-secondary-50': '217 240 255', // #d9f0ff
    '--color-secondary-100': '204 235 255', // #ccebff
    '--color-secondary-200': '191 230 255', // #bfe6ff
    '--color-secondary-300': '153 214 255', // #99d6ff
    '--color-secondary-400': '77 184 255', // #4db8ff
    '--color-secondary-500': '0 153 255', // #0099ff
    '--color-secondary-600': '0 138 230', // #008ae6
    '--color-secondary-700': '0 115 191', // #0073bf
    '--color-secondary-800': '0 92 153', // #005c99
    '--color-secondary-900': '0 75 125', // #004b7d
    // tertiary | #F2A097
    '--color-tertiary-50': '253 241 239', // #fdf1ef
    '--color-tertiary-100': '252 236 234', // #fcecea
    '--color-tertiary-200': '252 231 229', // #fce7e5
    '--color-tertiary-300': '250 217 213', // #fad9d5
    '--color-tertiary-400': '246 189 182', // #f6bdb6
    '--color-tertiary-500': '242 160 151', // #F2A097
    '--color-tertiary-600': '218 144 136', // #da9088
    '--color-tertiary-700': '182 120 113', // #b67871
    '--color-tertiary-800': '145 96 91', // #91605b
    '--color-tertiary-900': '119 78 74', // #774e4a
    // success | #27AE60
    '--color-success-50': '223 243 231', // #dff3e7
    '--color-success-100': '212 239 223', // #d4efdf
    '--color-success-200': '201 235 215', // #c9ebd7
    '--color-success-300': '169 223 191', // #a9dfbf
    '--color-success-400': '104 198 144', // #68c690
    '--color-success-500': '39 174 96', // #27AE60
    '--color-success-600': '35 157 86', // #239d56
    '--color-success-700': '29 131 72', // #1d8348
    '--color-success-800': '23 104 58', // #17683a
    '--color-success-900': '19 85 47', // #13552f
    // warning | #F39C12
    '--color-warning-50': '253 240 219', // #fdf0db
    '--color-warning-100': '253 235 208', // #fdebd0
    '--color-warning-200': '252 230 196', // #fce6c4
    '--color-warning-300': '250 215 160', // #fad7a0
    '--color-warning-400': '247 186 89', // #f7ba59
    '--color-warning-500': '243 156 18', // #F39C12
    '--color-warning-600': '219 140 16', // #db8c10
    '--color-warning-700': '182 117 14', // #b6750e
    '--color-warning-800': '146 94 11', // #925e0b
    '--color-warning-900': '119 76 9', // #774c09
    // error | #FF6B6B
    '--color-error-50': '255 233 233', // #ffe9e9
    '--color-error-100': '255 225 225', // #ffe1e1
    '--color-error-200': '255 218 218', // #ffdada
    '--color-error-300': '255 196 196', // #ffc4c4
    '--color-error-400': '255 151 151', // #ff9797
    '--color-error-500': '255 107 107', // #FF6B6B
    '--color-error-600': '230 96 96', // #e66060
    '--color-error-700': '191 80 80', // #bf5050
    '--color-error-800': '153 64 64', // #994040
    '--color-error-900': '125 52 52', // #7d3434
    // surface | #1F1F1F
    '--color-surface-50': '221 221 221', // #dddddd
    '--color-surface-100': '210 210 210', // #d2d2d2
    '--color-surface-200': '199 199 199', // #c7c7c7
    '--color-surface-300': '165 165 165', // #a5a5a5
    '--color-surface-400': '98 98 98', // #626262
    '--color-surface-500': '31 31 31', // #1F1F1F
    '--color-surface-600': '28 28 28', // #1c1c1c
    '--color-surface-700': '23 23 23', // #171717
    '--color-surface-800': '19 19 19', // #131313
    '--color-surface-900': '15 15 15' // #0f0f0f
  }
};

const galacticVibes: CustomThemeConfig = {
  name: 'galactic-vibes',
  properties: {
    // =~= Theme Properties =~=
    '--theme-font-family-base': `system-ui`,
    '--theme-font-family-heading': `system-ui`,
    '--theme-font-color-base': '0 0 0',
    '--theme-font-color-dark': '255 255 255',
    '--theme-rounded-base': '9999px',
    '--theme-rounded-container': '6px',
    '--theme-border-base': '1px',
    // =~= Theme On-X Colors =~=
    '--on-primary': '255 255 255',
    '--on-secondary': '255 255 255',
    '--on-tertiary': '0 0 0',
    '--on-success': '0 0 0',
    '--on-warning': '0 0 0',
    '--on-error': '255 255 255',
    '--on-surface': '255 255 255',
    // =~= Theme Colors  =~=
    // primary | #1E1E2D
    '--color-primary-50': '221 221 224', // #dddde0
    '--color-primary-100': '210 210 213', // #d2d2d5
    '--color-primary-200': '199 199 203', // #c7c7cb
    '--color-primary-300': '165 165 171', // #a5a5ab
    '--color-primary-400': '98 98 108', // #62626c
    '--color-primary-500': '30 30 45', // #1E1E2D
    '--color-primary-600': '27 27 41', // #1b1b29
    '--color-primary-700': '23 23 34', // #171722
    '--color-primary-800': '18 18 27', // #12121b
    '--color-primary-900': '15 15 22', // #0f0f16
    // secondary | #722e8e
    '--color-secondary-50': '234 224 238', // #eae0ee
    '--color-secondary-100': '227 213 232', // #e3d5e8
    '--color-secondary-200': '220 203 227', // #dccbe3
    '--color-secondary-300': '199 171 210', // #c7abd2
    '--color-secondary-400': '156 109 176', // #9c6db0
    '--color-secondary-500': '114 46 142', // #722e8e
    '--color-secondary-600': '103 41 128', // #672980
    '--color-secondary-700': '86 35 107', // #56236b
    '--color-secondary-800': '68 28 85', // #441c55
    '--color-secondary-900': '56 23 70', // #381746
    // tertiary | #34a1ea
    '--color-tertiary-50': '225 241 252', // #e1f1fc
    '--color-tertiary-100': '214 236 251', // #d6ecfb
    '--color-tertiary-200': '204 232 250', // #cce8fa
    '--color-tertiary-300': '174 217 247', // #aed9f7
    '--color-tertiary-400': '113 189 240', // #71bdf0
    '--color-tertiary-500': '52 161 234', // #34a1ea
    '--color-tertiary-600': '47 145 211', // #2f91d3
    '--color-tertiary-700': '39 121 176', // #2779b0
    '--color-tertiary-800': '31 97 140', // #1f618c
    '--color-tertiary-900': '25 79 115', // #194f73
    // success | #2ECC71
    '--color-success-50': '224 247 234', // #e0f7ea
    '--color-success-100': '213 245 227', // #d5f5e3
    '--color-success-200': '203 242 220', // #cbf2dc
    '--color-success-300': '171 235 198', // #abebc6
    '--color-success-400': '109 219 156', // #6ddb9c
    '--color-success-500': '46 204 113', // #2ECC71
    '--color-success-600': '41 184 102', // #29b866
    '--color-success-700': '35 153 85', // #239955
    '--color-success-800': '28 122 68', // #1c7a44
    '--color-success-900': '23 100 55', // #176437
    // warning | #FFD500
    '--color-warning-50': '255 249 217', // #fff9d9
    '--color-warning-100': '255 247 204', // #fff7cc
    '--color-warning-200': '255 245 191', // #fff5bf
    '--color-warning-300': '255 238 153', // #ffee99
    '--color-warning-400': '255 226 77', // #ffe24d
    '--color-warning-500': '255 213 0', // #FFD500
    '--color-warning-600': '230 192 0', // #e6c000
    '--color-warning-700': '191 160 0', // #bfa000
    '--color-warning-800': '153 128 0', // #998000
    '--color-warning-900': '125 104 0', // #7d6800
    // error | #b40808
    '--color-error-50': '244 218 218', // #f4dada
    '--color-error-100': '240 206 206', // #f0cece
    '--color-error-200': '236 193 193', // #ecc1c1
    '--color-error-300': '225 156 156', // #e19c9c
    '--color-error-400': '203 82 82', // #cb5252
    '--color-error-500': '180 8 8', // #b40808
    '--color-error-600': '162 7 7', // #a20707
    '--color-error-700': '135 6 6', // #870606
    '--color-error-800': '108 5 5', // #6c0505
    '--color-error-900': '88 4 4', // #580404
    // surface | #252534
    '--color-surface-50': '222 222 225', // #dedee1
    '--color-surface-100': '211 211 214', // #d3d3d6
    '--color-surface-200': '201 201 204', // #c9c9cc
    '--color-surface-300': '168 168 174', // #a8a8ae
    '--color-surface-400': '102 102 113', // #666671
    '--color-surface-500': '37 37 52', // #252534
    '--color-surface-600': '33 33 47', // #21212f
    '--color-surface-700': '28 28 39', // #1c1c27
    '--color-surface-800': '22 22 31', // #16161f
    '--color-surface-900': '18 18 25' // #121219
  }
};

const livelySpectrum: CustomThemeConfig = {
  name: 'lively-spectrum',
  properties: {
    // =~= Theme Properties =~=
    '--theme-font-family-base': `system-ui`,
    '--theme-font-family-heading': `system-ui`,
    '--theme-font-color-base': '0 0 0',
    '--theme-font-color-dark': '255 255 255',
    '--theme-rounded-base': '9999px',
    '--theme-rounded-container': '6px',
    '--theme-border-base': '1px',
    // =~= Theme On-X Colors =~=
    '--on-primary': '255 255 255',
    '--on-secondary': '255 255 255',
    '--on-tertiary': '0 0 0',
    '--on-success': '0 0 0',
    '--on-warning': '0 0 0',
    '--on-error': '255 255 255',
    '--on-surface': '255 255 255',
    // =~= Theme Colors  =~=
    // primary | #ca3f90
    '--color-primary-50': '247 226 238', // #f7e2ee
    '--color-primary-100': '244 217 233', // #f4d9e9
    '--color-primary-200': '242 207 227', // #f2cfe3
    '--color-primary-300': '234 178 211', // #eab2d3
    '--color-primary-400': '218 121 177', // #da79b1
    '--color-primary-500': '202 63 144', // #ca3f90
    '--color-primary-600': '182 57 130', // #b63982
    '--color-primary-700': '152 47 108', // #982f6c
    '--color-primary-800': '121 38 86', // #792656
    '--color-primary-900': '99 31 71', // #631f47
    // secondary | #2d45cd
    '--color-secondary-50': '224 227 248', // #e0e3f8
    '--color-secondary-100': '213 218 245', // #d5daf5
    '--color-secondary-200': '203 209 243', // #cbd1f3
    '--color-secondary-300': '171 181 235', // #abb5eb
    '--color-secondary-400': '108 125 220', // #6c7ddc
    '--color-secondary-500': '45 69 205', // #2d45cd
    '--color-secondary-600': '41 62 185', // #293eb9
    '--color-secondary-700': '34 52 154', // #22349a
    '--color-secondary-800': '27 41 123', // #1b297b
    '--color-secondary-900': '22 34 100', // #162264
    // tertiary | #FFD740
    '--color-tertiary-50': '255 249 226', // #fff9e2
    '--color-tertiary-100': '255 247 217', // #fff7d9
    '--color-tertiary-200': '255 245 207', // #fff5cf
    '--color-tertiary-300': '255 239 179', // #ffefb3
    '--color-tertiary-400': '255 227 121', // #ffe379
    '--color-tertiary-500': '255 215 64', // #FFD740
    '--color-tertiary-600': '230 194 58', // #e6c23a
    '--color-tertiary-700': '191 161 48', // #bfa130
    '--color-tertiary-800': '153 129 38', // #998126
    '--color-tertiary-900': '125 105 31', // #7d691f
    // success | #4CAF50
    '--color-success-50': '228 243 229', // #e4f3e5
    '--color-success-100': '219 239 220', // #dbefdc
    '--color-success-200': '210 235 211', // #d2ebd3
    '--color-success-300': '183 223 185', // #b7dfb9
    '--color-success-400': '130 199 133', // #82c785
    '--color-success-500': '76 175 80', // #4CAF50
    '--color-success-600': '68 158 72', // #449e48
    '--color-success-700': '57 131 60', // #39833c
    '--color-success-800': '46 105 48', // #2e6930
    '--color-success-900': '37 86 39', // #255627
    // warning | #FF9100
    '--color-warning-50': '255 239 217', // #ffefd9
    '--color-warning-100': '255 233 204', // #ffe9cc
    '--color-warning-200': '255 228 191', // #ffe4bf
    '--color-warning-300': '255 211 153', // #ffd399
    '--color-warning-400': '255 178 77', // #ffb24d
    '--color-warning-500': '255 145 0', // #FF9100
    '--color-warning-600': '230 131 0', // #e68300
    '--color-warning-700': '191 109 0', // #bf6d00
    '--color-warning-800': '153 87 0', // #995700
    '--color-warning-900': '125 71 0', // #7d4700
    // error | #a71b37
    '--color-error-50': '242 221 225', // #f2dde1
    '--color-error-100': '237 209 215', // #edd1d7
    '--color-error-200': '233 198 205', // #e9c6cd
    '--color-error-300': '220 164 175', // #dca4af
    '--color-error-400': '193 95 115', // #c15f73
    '--color-error-500': '167 27 55', // #a71b37
    '--color-error-600': '150 24 50', // #961832
    '--color-error-700': '125 20 41', // #7d1429
    '--color-error-800': '100 16 33', // #641021
    '--color-error-900': '82 13 27', // #520d1b
    // surface | #4f4f4f
    '--color-surface-50': '229 229 229', // #e5e5e5
    '--color-surface-100': '220 220 220', // #dcdcdc
    '--color-surface-200': '211 211 211', // #d3d3d3
    '--color-surface-300': '185 185 185', // #b9b9b9
    '--color-surface-400': '132 132 132', // #848484
    '--color-surface-500': '79 79 79', // #4f4f4f
    '--color-surface-600': '71 71 71', // #474747
    '--color-surface-700': '59 59 59', // #3b3b3b
    '--color-surface-800': '47 47 47', // #2f2f2f
    '--color-surface-900': '39 39 39' // #272727
  }
};

const frutigerAero: CustomThemeConfig = {
  name: 'frutiger-aero',
  properties: {
    // =~= Theme Properties =~=
    '--theme-font-family-base': `system-ui`,
    '--theme-font-family-heading': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    '--theme-font-color-base': '0 0 0',
    '--theme-font-color-dark': '255 255 255',
    '--theme-rounded-base': '9999px',
    '--theme-rounded-container': '24px',
    '--theme-border-base': '1px',
    // =~= Theme On-X Colors =~=
    '--on-primary': '0 0 0',
    '--on-secondary': '0 0 0',
    '--on-tertiary': '0 0 0',
    '--on-success': '0 0 0',
    '--on-warning': '0 0 0',
    '--on-error': '255 255 255',
    '--on-surface': '255 255 255',
    // =~= Theme Colors  =~=
    // primary | #00FFA3
    '--color-primary-50': '217 255 241', // #d9fff1
    '--color-primary-100': '204 255 237', // #ccffed
    '--color-primary-200': '191 255 232', // #bfffe8
    '--color-primary-300': '153 255 218', // #99ffda
    '--color-primary-400': '77 255 191', // #4dffbf
    '--color-primary-500': '0 255 163', // #00FFA3
    '--color-primary-600': '0 230 147', // #00e693
    '--color-primary-700': '0 191 122', // #00bf7a
    '--color-primary-800': '0 153 98', // #009962
    '--color-primary-900': '0 125 80', // #007d50
    // secondary | #00A8E8
    '--color-secondary-50': '217 242 252', // #d9f2fc
    '--color-secondary-100': '204 238 250', // #cceefa
    '--color-secondary-200': '191 233 249', // #bfe9f9
    '--color-secondary-300': '153 220 246', // #99dcf6
    '--color-secondary-400': '77 194 239', // #4dc2ef
    '--color-secondary-500': '0 168 232', // #00A8E8
    '--color-secondary-600': '0 151 209', // #0097d1
    '--color-secondary-700': '0 126 174', // #007eae
    '--color-secondary-800': '0 101 139', // #00658b
    '--color-secondary-900': '0 82 114', // #005272
    // tertiary | #FFD700
    '--color-tertiary-50': '255 249 217', // #fff9d9
    '--color-tertiary-100': '255 247 204', // #fff7cc
    '--color-tertiary-200': '255 245 191', // #fff5bf
    '--color-tertiary-300': '255 239 153', // #ffef99
    '--color-tertiary-400': '255 227 77', // #ffe34d
    '--color-tertiary-500': '255 215 0', // #FFD700
    '--color-tertiary-600': '230 194 0', // #e6c200
    '--color-tertiary-700': '191 161 0', // #bfa100
    '--color-tertiary-800': '153 129 0', // #998100
    '--color-tertiary-900': '125 105 0', // #7d6900
    // success | #4CAF50
    '--color-success-50': '228 243 229', // #e4f3e5
    '--color-success-100': '219 239 220', // #dbefdc
    '--color-success-200': '210 235 211', // #d2ebd3
    '--color-success-300': '183 223 185', // #b7dfb9
    '--color-success-400': '130 199 133', // #82c785
    '--color-success-500': '76 175 80', // #4CAF50
    '--color-success-600': '68 158 72', // #449e48
    '--color-success-700': '57 131 60', // #39833c
    '--color-success-800': '46 105 48', // #2e6930
    '--color-success-900': '37 86 39', // #255627
    // warning | #FF6F61
    '--color-warning-50': '255 233 231', // #ffe9e7
    '--color-warning-100': '255 226 223', // #ffe2df
    '--color-warning-200': '255 219 216', // #ffdbd8
    '--color-warning-300': '255 197 192', // #ffc5c0
    '--color-warning-400': '255 154 144', // #ff9a90
    '--color-warning-500': '255 111 97', // #FF6F61
    '--color-warning-600': '230 100 87', // #e66457
    '--color-warning-700': '191 83 73', // #bf5349
    '--color-warning-800': '153 67 58', // #99433a
    '--color-warning-900': '125 54 48', // #7d3630
    // error | #d20449
    '--color-error-50': '248 217 228', // #f8d9e4
    '--color-error-100': '246 205 219', // #f6cddb
    '--color-error-200': '244 192 210', // #f4c0d2
    '--color-error-300': '237 155 182', // #ed9bb6
    '--color-error-400': '224 79 128', // #e04f80
    '--color-error-500': '210 4 73', // #d20449
    '--color-error-600': '189 4 66', // #bd0442
    '--color-error-700': '158 3 55', // #9e0337
    '--color-error-800': '126 2 44', // #7e022c
    '--color-error-900': '103 2 36', // #670224
    // surface | #383333
    '--color-surface-50': '225 224 224', // #e1e0e0
    '--color-surface-100': '215 214 214', // #d7d6d6
    '--color-surface-200': '205 204 204', // #cdcccc
    '--color-surface-300': '175 173 173', // #afadad
    '--color-surface-400': '116 112 112', // #747070
    '--color-surface-500': '56 51 51', // #383333
    '--color-surface-600': '50 46 46', // #322e2e
    '--color-surface-700': '42 38 38', // #2a2626
    '--color-surface-800': '34 31 31', // #221f1f
    '--color-surface-900': '27 25 25' // #1b1919
  }
};

export { midnightVibes, galacticVibes, livelySpectrum, frutigerAero };
