'''
Placed inside a git-repo it will checkout (-index) of all tags starting with the prefix.

'''

import subprocess

TAG_PREFIX = 'v'
OUTPUT_ROOT = '/stats/'

def _invoke_git_cmd(args):
    git_args = ['git'] + args

    out_put = subprocess.check_output(git_args, stderr=subprocess.STDOUT, shell=True)
    print out_put
    return out_put

def get_tags():
    tags = []
    raw_tags = _invoke_git_cmd(['tag']).split('\n')

    for t in raw_tags:
        if t.startswith(TAG_PREFIX):
            tags.append(t)

    return tags

def checkout_tag(tag):
    return _invoke_git_cmd(['checkout', tag])

def checkout_index(tag):
    return _invoke_git_cmd(['checkout-index', '-a', '-f', '--prefix=' + OUTPUT_ROOT + tag + '/'])

if __name__ == '__main__':
    tags = get_tags()
    #tags = ['v2.0.0']

    for tag in tags:
        checkout_tag(tag)
        checkout_index(tag)
        print 'Done with ', tag
