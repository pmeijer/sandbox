'''
Script for generating cloc from a range of directories (starting with v)

cwd/dir1
    dir2
    ...
    dirN

gen_root_stats: Generates CLOC data for all files inside a dir.
gen_test_stats: Generates CLOC data for all folders containing 'test' inside a dir.

N.B. Run each mode separatley (on my machine there were issues running both at the same time).
'''
import subprocess
import os

DIR_PREFIX = 'v'
TEST_PREFIX = 'test'

def _invoke_cloc_cmd(args):
    cloc_args = ['cloc'] + args
    exec_str = ' '.join(cloc_args)
    print exec_str
    out_put = subprocess.check_output(cloc_args, stderr=subprocess.STDOUT, shell=True)

    return exec_str

def get_dirs():
    dirs = []
    raw_dirs = os.listdir('.')

    for d in raw_dirs:
        if d.startswith(DIR_PREFIX):
            dirs.append(d)

    return dirs

def gen_root_stats(tag):
    out_file = os.path.join('cloc_out', tag + '_root.csv')
    return _invoke_cloc_cmd([tag, '--csv', '--out=' + out_file])

def gen_test_stats(tag):
    paths = os.listdir(tag)
    test_folders = []
    for p in paths:
        p_full = os.path.join(tag, p)
        if p.find(TEST_PREFIX) > -1 and os.path.isdir(p_full):
            test_folders.append(p_full)
    print test_folders
    out_file = os.path.join('cloc_out', tag + '_test.csv')
    if len(test_folders) > 0:
        return _invoke_cloc_cmd([' '.join(test_folders), '--csv', '--out=' + out_file])

if __name__ == '__main__':
    dirs = get_dirs()
    #tags = ['v2.0.0']

    for d in dirs:
        try:
            #gen_root_stats(d)
            gen_test_stats(d)
        except Exception as err:
            print err
